"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDefaultRuleMonitoring = exports.TaskRunner = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _elasticApmNode = _interopRequireDefault(require("elastic-apm-node"));

var _lodash = require("lodash");

var _uuid = _interopRequireDefault(require("uuid"));

var _server = require("../../../spaces/server");

var _server2 = require("../../../../../src/core/server");

var _server3 = require("../../../task_manager/server");

var _create_execution_handler = require("./create_execution_handler");

var _alert_instance = require("../alert_instance");

var _lib = require("../lib");

var _types = require("../types");

var _result_type = require("../lib/result_type");

var _monitoring = require("../lib/monitoring");

var _alert_task_instance = require("./alert_task_instance");

var _plugin = require("../plugin");

var _server4 = require("../../../event_log/server");

var _is_alerting_error = require("../lib/is_alerting_error");

var _saved_objects = require("../saved_objects");

var _common = require("../../common");

var _errors = require("../lib/errors");

var _create_alert_event_log_record_object = require("../lib/create_alert_event_log_record_object");

var _create_abortable_es_client_factory = require("../lib/create_abortable_es_client_factory");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const FALLBACK_RETRY_INTERVAL = '5m';
const CONNECTIVITY_RETRY_INTERVAL = '5m'; // 1,000,000 nanoseconds in 1 millisecond

const Millis2Nanos = 1000 * 1000;

const getDefaultRuleMonitoring = () => ({
  execution: {
    history: [],
    calculated_metrics: {
      success_ratio: 0
    }
  }
});

exports.getDefaultRuleMonitoring = getDefaultRuleMonitoring;

class TaskRunner {
  constructor(ruleType, taskInstance, context) {
    (0, _defineProperty2.default)(this, "context", void 0);
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "taskInstance", void 0);
    (0, _defineProperty2.default)(this, "ruleName", void 0);
    (0, _defineProperty2.default)(this, "ruleType", void 0);
    (0, _defineProperty2.default)(this, "executionId", void 0);
    (0, _defineProperty2.default)(this, "ruleTypeRegistry", void 0);
    (0, _defineProperty2.default)(this, "usageCounter", void 0);
    (0, _defineProperty2.default)(this, "searchAbortController", void 0);
    (0, _defineProperty2.default)(this, "cancelled", void 0);
    this.context = context;
    this.logger = context.logger;
    this.usageCounter = context.usageCounter;
    this.ruleType = ruleType;
    this.ruleName = null;
    this.taskInstance = (0, _alert_task_instance.taskInstanceToAlertTaskInstance)(taskInstance);
    this.ruleTypeRegistry = context.ruleTypeRegistry;
    this.searchAbortController = new AbortController();
    this.cancelled = false;
    this.executionId = _uuid.default.v4();
  }

  async getDecryptedAttributes(ruleId, spaceId) {
    const namespace = this.context.spaceIdToNamespace(spaceId); // Only fetch encrypted attributes here, we'll create a saved objects client
    // scoped with the API key to fetch the remaining data.

    const {
      attributes: {
        apiKey,
        enabled
      }
    } = await this.context.encryptedSavedObjectsClient.getDecryptedAsInternalUser('alert', ruleId, {
      namespace
    });
    return {
      apiKey,
      enabled
    };
  }

  getFakeKibanaRequest(spaceId, apiKey) {
    const requestHeaders = {};

    if (apiKey) {
      requestHeaders.authorization = `ApiKey ${apiKey}`;
    }

    const path = (0, _server.addSpaceIdToPath)('/', spaceId);

    const fakeRequest = _server2.KibanaRequest.from({
      headers: requestHeaders,
      path: '/',
      route: {
        settings: {}
      },
      url: {
        href: '/'
      },
      raw: {
        req: {
          url: '/'
        }
      }
    });

    this.context.basePathService.set(fakeRequest, path);
    return fakeRequest;
  }

  getServicesWithSpaceLevelPermissions(spaceId, apiKey) {
    const request = this.getFakeKibanaRequest(spaceId, apiKey);
    return [this.context.getServices(request), this.context.getRulesClientWithRequest(request)];
  }

  getExecutionHandler(ruleId, ruleName, tags, spaceId, apiKey, kibanaBaseUrl, actions, ruleParams) {
    return (0, _create_execution_handler.createExecutionHandler)({
      ruleId,
      ruleName,
      tags,
      executionId: this.executionId,
      logger: this.logger,
      actionsPlugin: this.context.actionsPlugin,
      apiKey,
      actions,
      spaceId,
      ruleType: this.ruleType,
      kibanaBaseUrl,
      eventLogger: this.context.eventLogger,
      request: this.getFakeKibanaRequest(spaceId, apiKey),
      ruleParams,
      supportsEphemeralTasks: this.context.supportsEphemeralTasks,
      maxEphemeralActionsPerRule: this.context.maxEphemeralActionsPerRule
    });
  }

  async updateRuleSavedObject(ruleId, namespace, attributes) {
    const client = this.context.internalSavedObjectsRepository;

    try {
      await (0, _saved_objects.partiallyUpdateAlert)(client, ruleId, attributes, {
        ignore404: true,
        namespace,
        refresh: false
      });
    } catch (err) {
      this.logger.error(`error updating rule for ${this.ruleType.id}:${ruleId} ${err.message}`);
    }
  }

  shouldLogAndScheduleActionsForAlerts() {
    // if execution hasn't been cancelled, return true
    if (!this.cancelled) {
      return true;
    } // if execution has been cancelled, return true if EITHER alerting config or rule type indicate to proceed with scheduling actions


    return !this.context.cancelAlertsOnRuleTimeout || !this.ruleType.cancelAlertsOnRuleTimeout;
  }

  countUsageOfActionExecutionAfterRuleCancellation() {
    if (this.cancelled && this.usageCounter) {
      if (this.context.cancelAlertsOnRuleTimeout && this.ruleType.cancelAlertsOnRuleTimeout) {
        // Increment usage counter for skipped actions
        this.usageCounter.incrementCounter({
          counterName: `alertsSkippedDueToRuleExecutionTimeout_${this.ruleType.id}`,
          incrementBy: 1
        });
      }
    }
  }

  async executeAlert(alertId, alert, executionHandler) {
    const {
      actionGroup,
      subgroup: actionSubgroup,
      context,
      state
    } = alert.getScheduledActionOptions();
    alert.updateLastScheduledActions(actionGroup, actionSubgroup);
    alert.unscheduleActions();
    return executionHandler({
      actionGroup,
      actionSubgroup,
      context,
      state,
      alertId
    });
  }

  async executeAlerts(services, rule, params, executionHandler, spaceId, event) {
    const {
      alertTypeId,
      consumer,
      schedule,
      throttle,
      notifyWhen,
      muteAll,
      mutedInstanceIds,
      name,
      tags,
      createdBy,
      updatedBy,
      createdAt,
      updatedAt,
      enabled,
      actions
    } = rule;
    const {
      params: {
        alertId: ruleId
      },
      state: {
        alertInstances: alertRawInstances = {},
        alertTypeState = {},
        previousStartedAt
      }
    } = this.taskInstance;
    const namespace = this.context.spaceIdToNamespace(spaceId);
    const ruleType = this.ruleTypeRegistry.get(alertTypeId);
    const alerts = (0, _lodash.mapValues)(alertRawInstances, rawAlert => new _alert_instance.AlertInstance(rawAlert));
    const originalAlerts = (0, _lodash.cloneDeep)(alerts);
    const originalAlertIds = new Set(Object.keys(originalAlerts));
    const eventLogger = this.context.eventLogger;
    const ruleLabel = `${this.ruleType.id}:${ruleId}: '${name}'`;
    let updatedRuleTypeState;

    try {
      const ctx = {
        type: 'alert',
        name: `execute ${rule.alertTypeId}`,
        id: ruleId,
        description: `execute [${rule.alertTypeId}] with name [${name}] in [${namespace !== null && namespace !== void 0 ? namespace : 'default'}] namespace`
      };
      updatedRuleTypeState = await this.context.executionContext.withContext(ctx, () => this.ruleType.executor({
        alertId: ruleId,
        executionId: this.executionId,
        services: { ...services,
          alertInstanceFactory: (0, _alert_instance.createAlertInstanceFactory)(alerts),
          shouldWriteAlerts: () => this.shouldLogAndScheduleActionsForAlerts(),
          shouldStopExecution: () => this.cancelled,
          search: (0, _create_abortable_es_client_factory.createAbortableEsClientFactory)({
            scopedClusterClient: services.scopedClusterClient,
            abortController: this.searchAbortController
          })
        },
        params,
        state: alertTypeState,
        startedAt: this.taskInstance.startedAt,
        previousStartedAt: previousStartedAt ? new Date(previousStartedAt) : null,
        spaceId,
        namespace,
        name,
        tags,
        createdBy,
        updatedBy,
        rule: {
          name,
          tags,
          consumer,
          producer: ruleType.producer,
          ruleTypeId: rule.alertTypeId,
          ruleTypeName: ruleType.name,
          enabled,
          schedule,
          actions,
          createdBy,
          updatedBy,
          createdAt,
          updatedAt,
          throttle,
          notifyWhen
        }
      }));
    } catch (err) {
      event.message = `rule execution failure: ${ruleLabel}`;
      event.error = event.error || {};
      event.error.message = err.message;
      event.event = event.event || {};
      event.event.outcome = 'failure';
      throw new _lib.ErrorWithReason(_types.AlertExecutionStatusErrorReasons.Execute, err);
    }

    event.message = `rule executed: ${ruleLabel}`;
    event.event = event.event || {};
    event.event.outcome = 'success';
    event.rule = { ...event.rule,
      name: rule.name
    }; // Cleanup alerts that are no longer scheduling actions to avoid over populating the alertInstances object

    const alertsWithScheduledActions = (0, _lodash.pickBy)(alerts, alert => alert.hasScheduledActions());
    const recoveredAlerts = (0, _lodash.pickBy)(alerts, (alert, id) => !alert.hasScheduledActions() && originalAlertIds.has(id));
    logActiveAndRecoveredAlerts({
      logger: this.logger,
      activeAlerts: alertsWithScheduledActions,
      recoveredAlerts,
      ruleLabel
    });
    trackAlertDurations({
      originalAlerts,
      currentAlerts: alertsWithScheduledActions,
      recoveredAlerts
    });

    if (this.shouldLogAndScheduleActionsForAlerts()) {
      generateNewAndRecoveredAlertEvents({
        eventLogger,
        executionId: this.executionId,
        originalAlerts,
        currentAlerts: alertsWithScheduledActions,
        recoveredAlerts,
        ruleId,
        ruleLabel,
        namespace,
        ruleType,
        rule
      });
    }

    let triggeredActions = [];

    if (!muteAll && this.shouldLogAndScheduleActionsForAlerts()) {
      const mutedAlertIdsSet = new Set(mutedInstanceIds);
      const scheduledActionsForRecoveredAlerts = await scheduleActionsForRecoveredAlerts({
        recoveryActionGroup: this.ruleType.recoveryActionGroup,
        recoveredAlerts,
        executionHandler,
        mutedAlertIdsSet,
        logger: this.logger,
        ruleLabel
      });
      triggeredActions = (0, _lodash.concat)(triggeredActions, scheduledActionsForRecoveredAlerts);
      const alertsToExecute = Object.entries(alertsWithScheduledActions).filter(([alertName, alert]) => {
        const throttled = alert.isThrottled(throttle);
        const muted = mutedAlertIdsSet.has(alertName);
        let shouldExecuteAction = true;

        if (throttled || muted) {
          shouldExecuteAction = false;
          this.logger.debug(`skipping scheduling of actions for '${alertName}' in rule ${ruleLabel}: rule is ${muted ? 'muted' : 'throttled'}`);
        } else if (notifyWhen === 'onActionGroupChange' && !alert.scheduledActionGroupOrSubgroupHasChanged()) {
          shouldExecuteAction = false;
          this.logger.debug(`skipping scheduling of actions for '${alertName}' in rule ${ruleLabel}: alert is active but action group has not changed`);
        }

        return shouldExecuteAction;
      });
      const allTriggeredActions = await Promise.all(alertsToExecute.map(([alertId, alert]) => this.executeAlert(alertId, alert, executionHandler)));
      triggeredActions = (0, _lodash.concat)(triggeredActions, ...allTriggeredActions);
    } else {
      if (muteAll) {
        this.logger.debug(`no scheduling of actions for rule ${ruleLabel}: rule is muted.`);
      }

      if (!this.shouldLogAndScheduleActionsForAlerts()) {
        this.logger.debug(`no scheduling of actions for rule ${ruleLabel}: rule execution has been cancelled.`); // Usage counter for telemetry
        // This keeps track of how many times action executions were skipped after rule
        // execution completed successfully after the execution timeout
        // This can occur when rule executors do not short circuit execution in response
        // to timeout

        this.countUsageOfActionExecutionAfterRuleCancellation();
      }
    }

    return {
      triggeredActions,
      alertTypeState: updatedRuleTypeState || undefined,
      alertInstances: (0, _lodash.mapValues)(alertsWithScheduledActions, alert => alert.toRaw())
    };
  }

  async validateAndExecuteRule(services, apiKey, rule, event) {
    var _this$ruleType$valida;

    const {
      params: {
        alertId: ruleId,
        spaceId
      }
    } = this.taskInstance; // Validate

    const validatedParams = (0, _lib.validateRuleTypeParams)(rule.params, (_this$ruleType$valida = this.ruleType.validate) === null || _this$ruleType$valida === void 0 ? void 0 : _this$ruleType$valida.params);
    const executionHandler = this.getExecutionHandler(ruleId, rule.name, rule.tags, spaceId, apiKey, this.context.kibanaBaseUrl, rule.actions, rule.params);
    return this.executeAlerts(services, rule, validatedParams, executionHandler, spaceId, event);
  }

  async loadRuleAttributesAndRun(event) {
    const {
      params: {
        alertId: ruleId,
        spaceId
      }
    } = this.taskInstance;
    let enabled;
    let apiKey;

    try {
      const decryptedAttributes = await this.getDecryptedAttributes(ruleId, spaceId);
      apiKey = decryptedAttributes.apiKey;
      enabled = decryptedAttributes.enabled;
    } catch (err) {
      throw new _lib.ErrorWithReason(_types.AlertExecutionStatusErrorReasons.Decrypt, err);
    }

    if (!enabled) {
      throw new _lib.ErrorWithReason(_types.AlertExecutionStatusErrorReasons.Disabled, new Error(`Rule failed to execute because rule ran after it was disabled.`));
    }

    const [services, rulesClient] = this.getServicesWithSpaceLevelPermissions(spaceId, apiKey);
    let rule; // Ensure API key is still valid and user has access

    try {
      rule = await rulesClient.get({
        id: ruleId
      });

      if (_elasticApmNode.default.currentTransaction) {
        _elasticApmNode.default.currentTransaction.name = `Execute Alerting Rule: "${rule.name}"`;

        _elasticApmNode.default.currentTransaction.addLabels({
          alerting_rule_consumer: rule.consumer,
          alerting_rule_name: rule.name,
          alerting_rule_tags: rule.tags.join(', '),
          alerting_rule_type_id: rule.alertTypeId,
          alerting_rule_params: JSON.stringify(rule.params)
        });
      }
    } catch (err) {
      throw new _lib.ErrorWithReason(_types.AlertExecutionStatusErrorReasons.Read, err);
    }

    this.ruleName = rule.name;

    try {
      this.ruleTypeRegistry.ensureRuleTypeEnabled(rule.alertTypeId);
    } catch (err) {
      throw new _lib.ErrorWithReason(_types.AlertExecutionStatusErrorReasons.License, err);
    }

    if (rule.monitoring) {
      if (rule.monitoring.execution.history.length >= _common.MONITORING_HISTORY_LIMIT) {
        // Remove the first (oldest) record
        rule.monitoring.execution.history.shift();
      }
    }

    return {
      monitoring: (0, _result_type.asOk)(rule.monitoring),
      state: await (0, _result_type.promiseResult)(this.validateAndExecuteRule(services, apiKey, rule, event)),
      schedule: (0, _result_type.asOk)( // fetch the rule again to ensure we return the correct schedule as it may have
      // cahnged during the task execution
      (await rulesClient.get({
        id: ruleId
      })).schedule)
    };
  }

  async run() {
    var _resolveErr, _event$event, _event$event2;

    const {
      params: {
        alertId: ruleId,
        spaceId
      },
      startedAt,
      state: originalState,
      schedule: taskSchedule
    } = this.taskInstance;

    if (_elasticApmNode.default.currentTransaction) {
      _elasticApmNode.default.currentTransaction.name = `Execute Alerting Rule`;

      _elasticApmNode.default.currentTransaction.addLabels({
        alerting_rule_id: ruleId
      });
    }

    const runDate = new Date();
    const runDateString = runDate.toISOString();
    this.logger.debug(`executing rule ${this.ruleType.id}:${ruleId} at ${runDateString}`);
    const namespace = this.context.spaceIdToNamespace(spaceId);
    const eventLogger = this.context.eventLogger;
    const scheduleDelay = runDate.getTime() - this.taskInstance.runAt.getTime();
    const event = (0, _create_alert_event_log_record_object.createAlertEventLogRecordObject)({
      ruleId,
      ruleType: this.ruleType,
      action: _plugin.EVENT_LOG_ACTIONS.execute,
      namespace,
      executionId: this.executionId,
      task: {
        scheduled: this.taskInstance.runAt.toISOString(),
        scheduleDelay: Millis2Nanos * scheduleDelay
      },
      savedObjects: [{
        id: ruleId,
        type: 'alert',
        typeId: this.ruleType.id,
        relation: _server4.SAVED_OBJECT_REL_PRIMARY
      }]
    });
    eventLogger.startTiming(event);
    const startEvent = (0, _lodash.cloneDeep)({ ...event,
      event: { ...event.event,
        action: _plugin.EVENT_LOG_ACTIONS.executeStart
      },
      message: `rule execution start: "${ruleId}"`
    });
    eventLogger.logEvent(startEvent);
    const {
      state,
      schedule,
      monitoring
    } = await errorAsRuleTaskRunResult(this.loadRuleAttributesAndRun(event));
    const ruleMonitoring = (_resolveErr = (0, _result_type.resolveErr)(monitoring, () => {
      return getDefaultRuleMonitoring();
    })) !== null && _resolveErr !== void 0 ? _resolveErr : getDefaultRuleMonitoring();
    const executionStatus = (0, _result_type.map)(state, ruleTaskState => (0, _lib.executionStatusFromState)(ruleTaskState), err => (0, _lib.executionStatusFromError)(err)); // set the executionStatus date to same as event, if it's set

    if ((_event$event = event.event) !== null && _event$event !== void 0 && _event$event.start) {
      executionStatus.lastExecutionDate = new Date(event.event.start);
    }

    if (_elasticApmNode.default.currentTransaction) {
      if (executionStatus.status === 'ok' || executionStatus.status === 'active') {
        _elasticApmNode.default.currentTransaction.setOutcome('success');
      } else if (executionStatus.status === 'error' || executionStatus.status === 'unknown') {
        _elasticApmNode.default.currentTransaction.setOutcome('failure');
      }
    }

    this.logger.debug(`ruleExecutionStatus for ${this.ruleType.id}:${ruleId}: ${JSON.stringify(executionStatus)}`);
    eventLogger.stopTiming(event);
    (0, _lodash.set)(event, 'kibana.alerting.status', executionStatus.status);
    const monitoringHistory = {
      success: true,
      timestamp: +new Date()
    }; // Copy duration into execution status if available

    if (null != ((_event$event2 = event.event) === null || _event$event2 === void 0 ? void 0 : _event$event2.duration)) {
      var _event$event3;

      executionStatus.lastDuration = Math.round(((_event$event3 = event.event) === null || _event$event3 === void 0 ? void 0 : _event$event3.duration) / Millis2Nanos);
      monitoringHistory.duration = executionStatus.lastDuration;
    } // if executionStatus indicates an error, fill in fields in
    // event from it


    if (executionStatus.error) {
      var _executionStatus$erro, _event$error;

      (0, _lodash.set)(event, 'event.reason', ((_executionStatus$erro = executionStatus.error) === null || _executionStatus$erro === void 0 ? void 0 : _executionStatus$erro.reason) || 'unknown');
      (0, _lodash.set)(event, 'event.outcome', 'failure');
      (0, _lodash.set)(event, 'error.message', (event === null || event === void 0 ? void 0 : (_event$error = event.error) === null || _event$error === void 0 ? void 0 : _event$error.message) || executionStatus.error.message);

      if (!event.message) {
        event.message = `${this.ruleType.id}:${ruleId}: execution failed`;
      }

      monitoringHistory.success = false;
    } else {
      var _executionStatus$numb;

      (0, _lodash.set)(event, 'kibana.alert.rule.execution.metrics.number_of_triggered_actions', (_executionStatus$numb = executionStatus.numberOfTriggeredActions) !== null && _executionStatus$numb !== void 0 ? _executionStatus$numb : 0);
    }

    ruleMonitoring.execution.history.push(monitoringHistory);
    ruleMonitoring.execution.calculated_metrics = {
      success_ratio: (0, _monitoring.getExecutionSuccessRatio)(ruleMonitoring),
      ...(0, _monitoring.getExecutionDurationPercentiles)(ruleMonitoring)
    };
    eventLogger.logEvent(event);

    if (!this.cancelled) {
      this.logger.debug(`Updating rule task for ${this.ruleType.id} rule with id ${ruleId} - ${JSON.stringify(executionStatus)}`);
      await this.updateRuleSavedObject(ruleId, namespace, {
        executionStatus: (0, _lib.ruleExecutionStatusToRaw)(executionStatus),
        monitoring: ruleMonitoring
      });
    }

    const transformStateForTaskState = stateWithActions => {
      return { ...(0, _lodash.omit)(stateWithActions, 'triggeredActions'),
        previousStartedAt: startedAt
      };
    };

    return {
      state: (0, _result_type.map)(state, stateWithActions => transformStateForTaskState(stateWithActions), err => {
        const message = `Executing Rule ${spaceId}:${this.ruleType.id}:${ruleId} has resulted in Error: ${(0, _errors.getEsErrorMessage)(err)}`;

        if ((0, _is_alerting_error.isAlertSavedObjectNotFoundError)(err, ruleId)) {
          this.logger.debug(message);
        } else {
          this.logger.error(message);
        }

        return originalState;
      }),
      schedule: (0, _result_type.resolveErr)(schedule, error => {
        var _taskSchedule$interva;

        if ((0, _is_alerting_error.isAlertSavedObjectNotFoundError)(error, ruleId)) {
          const spaceMessage = spaceId ? `in the "${spaceId}" space ` : '';
          this.logger.warn(`Unable to execute rule "${ruleId}" ${spaceMessage}because ${error.message} - this rule will not be rescheduled. To restart rule execution, try disabling and re-enabling this rule.`);
          (0, _server3.throwUnrecoverableError)(error);
        }

        let retryInterval = (_taskSchedule$interva = taskSchedule === null || taskSchedule === void 0 ? void 0 : taskSchedule.interval) !== null && _taskSchedule$interva !== void 0 ? _taskSchedule$interva : FALLBACK_RETRY_INTERVAL; // Set retry interval smaller for ES connectivity errors

        if ((0, _is_alerting_error.isEsUnavailableError)(error, ruleId)) {
          retryInterval = (0, _common.parseDuration)(retryInterval) > (0, _common.parseDuration)(CONNECTIVITY_RETRY_INTERVAL) ? CONNECTIVITY_RETRY_INTERVAL : retryInterval;
        }

        return {
          interval: retryInterval
        };
      }),
      monitoring: ruleMonitoring
    };
  }

  async cancel() {
    var _this$ruleName;

    if (this.cancelled) {
      return;
    }

    this.cancelled = true; // Write event log entry

    const {
      params: {
        alertId: ruleId,
        spaceId
      }
    } = this.taskInstance;
    const namespace = this.context.spaceIdToNamespace(spaceId);
    this.logger.debug(`Cancelling rule type ${this.ruleType.id} with id ${ruleId} - execution exceeded rule type timeout of ${this.ruleType.ruleTaskTimeout}`);
    this.logger.debug(`Aborting any in-progress ES searches for rule type ${this.ruleType.id} with id ${ruleId}`);
    this.searchAbortController.abort();
    const eventLogger = this.context.eventLogger;
    const event = {
      event: {
        action: _plugin.EVENT_LOG_ACTIONS.executeTimeout,
        kind: 'alert',
        category: [this.ruleType.producer]
      },
      message: `rule: ${this.ruleType.id}:${ruleId}: '${(_this$ruleName = this.ruleName) !== null && _this$ruleName !== void 0 ? _this$ruleName : ''}' execution cancelled due to timeout - exceeded rule type timeout of ${this.ruleType.ruleTaskTimeout}`,
      kibana: {
        alert: {
          rule: {
            execution: {
              uuid: this.executionId
            }
          }
        },
        saved_objects: [{
          rel: _server4.SAVED_OBJECT_REL_PRIMARY,
          type: 'alert',
          id: ruleId,
          type_id: this.ruleType.id,
          namespace
        }]
      },
      rule: {
        id: ruleId,
        license: this.ruleType.minimumLicenseRequired,
        category: this.ruleType.id,
        ruleset: this.ruleType.producer,
        ...(this.ruleName ? {
          name: this.ruleName
        } : {})
      }
    };
    eventLogger.logEvent(event); // Update the rule saved object with execution status

    const executionStatus = {
      lastExecutionDate: new Date(),
      status: 'error',
      error: {
        reason: _types.AlertExecutionStatusErrorReasons.Timeout,
        message: `${this.ruleType.id}:${ruleId}: execution cancelled due to timeout - exceeded rule type timeout of ${this.ruleType.ruleTaskTimeout}`
      }
    };
    this.logger.debug(`Updating rule task for ${this.ruleType.id} rule with id ${ruleId} - execution error due to timeout`);
    await this.updateRuleSavedObject(ruleId, namespace, {
      executionStatus: (0, _lib.ruleExecutionStatusToRaw)(executionStatus)
    });
  }

}

exports.TaskRunner = TaskRunner;

function trackAlertDurations(params) {
  const currentTime = new Date().toISOString();
  const {
    currentAlerts,
    originalAlerts,
    recoveredAlerts
  } = params;
  const originalAlertIds = Object.keys(originalAlerts);
  const currentAlertIds = Object.keys(currentAlerts);
  const recoveredAlertIds = Object.keys(recoveredAlerts);
  const newAlertIds = (0, _lodash.without)(currentAlertIds, ...originalAlertIds); // Inject start time into alert state of new alerts

  for (const id of newAlertIds) {
    const state = currentAlerts[id].getState();
    currentAlerts[id].replaceState({ ...state,
      start: currentTime
    });
  } // Calculate duration to date for active alerts


  for (const id of currentAlertIds) {
    const state = originalAlertIds.includes(id) ? originalAlerts[id].getState() : currentAlerts[id].getState();
    const duration = state.start ? (new Date(currentTime).valueOf() - new Date(state.start).valueOf()) * 1000 * 1000 // nanoseconds
    : undefined;
    currentAlerts[id].replaceState({ ...state,
      ...(state.start ? {
        start: state.start
      } : {}),
      ...(duration !== undefined ? {
        duration
      } : {})
    });
  } // Inject end time into alert state of recovered alerts


  for (const id of recoveredAlertIds) {
    const state = recoveredAlerts[id].getState();
    const duration = state.start ? (new Date(currentTime).valueOf() - new Date(state.start).valueOf()) * 1000 * 1000 // nanoseconds
    : undefined;
    recoveredAlerts[id].replaceState({ ...state,
      ...(duration ? {
        duration
      } : {}),
      ...(state.start ? {
        end: currentTime
      } : {})
    });
  }
}

function generateNewAndRecoveredAlertEvents(params) {
  const {
    eventLogger,
    executionId,
    ruleId,
    namespace,
    currentAlerts,
    originalAlerts,
    recoveredAlerts,
    rule,
    ruleType
  } = params;
  const originalAlertIds = Object.keys(originalAlerts);
  const currentAlertIds = Object.keys(currentAlerts);
  const recoveredAlertIds = Object.keys(recoveredAlerts);
  const newIds = (0, _lodash.without)(currentAlertIds, ...originalAlertIds);

  if (_elasticApmNode.default.currentTransaction) {
    _elasticApmNode.default.currentTransaction.addLabels({
      alerting_new_alerts: newIds.length
    });
  }

  for (const id of recoveredAlertIds) {
    var _recoveredAlerts$id$g;

    const {
      group: actionGroup,
      subgroup: actionSubgroup
    } = (_recoveredAlerts$id$g = recoveredAlerts[id].getLastScheduledActions()) !== null && _recoveredAlerts$id$g !== void 0 ? _recoveredAlerts$id$g : {};
    const state = recoveredAlerts[id].getState();
    const message = `${params.ruleLabel} alert '${id}' has recovered`;
    logAlertEvent(id, _plugin.EVENT_LOG_ACTIONS.recoveredInstance, message, state, actionGroup, actionSubgroup);
  }

  for (const id of newIds) {
    var _currentAlerts$id$get;

    const {
      actionGroup,
      subgroup: actionSubgroup
    } = (_currentAlerts$id$get = currentAlerts[id].getScheduledActionOptions()) !== null && _currentAlerts$id$get !== void 0 ? _currentAlerts$id$get : {};
    const state = currentAlerts[id].getState();
    const message = `${params.ruleLabel} created new alert: '${id}'`;
    logAlertEvent(id, _plugin.EVENT_LOG_ACTIONS.newInstance, message, state, actionGroup, actionSubgroup);
  }

  for (const id of currentAlertIds) {
    var _currentAlerts$id$get2;

    const {
      actionGroup,
      subgroup: actionSubgroup
    } = (_currentAlerts$id$get2 = currentAlerts[id].getScheduledActionOptions()) !== null && _currentAlerts$id$get2 !== void 0 ? _currentAlerts$id$get2 : {};
    const state = currentAlerts[id].getState();
    const message = `${params.ruleLabel} active alert: '${id}' in ${actionSubgroup ? `actionGroup(subgroup): '${actionGroup}(${actionSubgroup})'` : `actionGroup: '${actionGroup}'`}`;
    logAlertEvent(id, _plugin.EVENT_LOG_ACTIONS.activeInstance, message, state, actionGroup, actionSubgroup);
  }

  function logAlertEvent(alertId, action, message, state, group, subgroup) {
    const event = {
      event: {
        action,
        kind: 'alert',
        category: [ruleType.producer],
        ...(state !== null && state !== void 0 && state.start ? {
          start: state.start
        } : {}),
        ...(state !== null && state !== void 0 && state.end ? {
          end: state.end
        } : {}),
        ...((state === null || state === void 0 ? void 0 : state.duration) !== undefined ? {
          duration: state.duration
        } : {})
      },
      kibana: {
        alert: {
          rule: {
            execution: {
              uuid: executionId
            }
          }
        },
        alerting: {
          instance_id: alertId,
          ...(group ? {
            action_group_id: group
          } : {}),
          ...(subgroup ? {
            action_subgroup: subgroup
          } : {})
        },
        saved_objects: [{
          rel: _server4.SAVED_OBJECT_REL_PRIMARY,
          type: 'alert',
          id: ruleId,
          type_id: ruleType.id,
          namespace
        }]
      },
      message,
      rule: {
        id: rule.id,
        license: ruleType.minimumLicenseRequired,
        category: ruleType.id,
        ruleset: ruleType.producer,
        name: rule.name
      }
    };
    eventLogger.logEvent(event);
  }
}

async function scheduleActionsForRecoveredAlerts(params) {
  const {
    logger,
    recoveryActionGroup,
    recoveredAlerts,
    executionHandler,
    mutedAlertIdsSet,
    ruleLabel
  } = params;
  const recoveredIds = Object.keys(recoveredAlerts);
  let triggeredActions = [];

  for (const id of recoveredIds) {
    if (mutedAlertIdsSet.has(id)) {
      logger.debug(`skipping scheduling of actions for '${id}' in rule ${ruleLabel}: instance is muted`);
    } else {
      const alert = recoveredAlerts[id];
      alert.updateLastScheduledActions(recoveryActionGroup.id);
      alert.unscheduleActions();
      const triggeredActionsForRecoveredAlert = await executionHandler({
        actionGroup: recoveryActionGroup.id,
        context: {},
        state: {},
        alertId: id
      });
      alert.scheduleActions(recoveryActionGroup.id);
      triggeredActions = (0, _lodash.concat)(triggeredActions, triggeredActionsForRecoveredAlert);
    }
  }

  return triggeredActions;
}

function logActiveAndRecoveredAlerts(params) {
  const {
    logger,
    activeAlerts,
    recoveredAlerts,
    ruleLabel
  } = params;
  const activeAlertIds = Object.keys(activeAlerts);
  const recoveredAlertIds = Object.keys(recoveredAlerts);

  if (_elasticApmNode.default.currentTransaction) {
    _elasticApmNode.default.currentTransaction.addLabels({
      alerting_active_alerts: activeAlertIds.length,
      alerting_recovered_alerts: recoveredAlertIds.length
    });
  }

  if (activeAlertIds.length > 0) {
    logger.debug(`rule ${ruleLabel} has ${activeAlertIds.length} active alerts: ${JSON.stringify(activeAlertIds.map(alertId => {
      var _activeAlerts$alertId;

      return {
        instanceId: alertId,
        actionGroup: (_activeAlerts$alertId = activeAlerts[alertId].getScheduledActionOptions()) === null || _activeAlerts$alertId === void 0 ? void 0 : _activeAlerts$alertId.actionGroup
      };
    }))}`);
  }

  if (recoveredAlertIds.length > 0) {
    logger.debug(`rule ${ruleLabel} has ${recoveredAlertIds.length} recovered alerts: ${JSON.stringify(recoveredAlertIds)}`);
  }
}
/**
 * If an error is thrown, wrap it in an RuleTaskRunResult
 * so that we can treat each field independantly
 */


async function errorAsRuleTaskRunResult(future) {
  try {
    return await future;
  } catch (e) {
    return {
      state: (0, _result_type.asErr)(e),
      schedule: (0, _result_type.asErr)(e),
      monitoring: (0, _result_type.asErr)(e)
    };
  }
}