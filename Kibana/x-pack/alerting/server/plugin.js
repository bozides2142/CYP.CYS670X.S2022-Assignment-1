"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LEGACY_EVENT_LOG_ACTIONS = exports.EVENT_LOG_PROVIDER = exports.EVENT_LOG_ACTIONS = exports.AlertingPlugin = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _operators = require("rxjs/operators");

var _rxjs = require("rxjs");

var _rule_type_registry = require("./rule_type_registry");

var _task_runner = require("./task_runner");

var _rules_client_factory = require("./rules_client_factory");

var _license_state = require("./lib/license_state");

var _server = require("../../../../src/core/server");

var _types = require("./types");

var _routes = require("./routes");

var _server2 = require("../../licensing/server");

var _usage = require("./usage");

var _task = require("./usage/task");

var _saved_objects = require("./saved_objects");

var _task2 = require("./invalidate_pending_api_keys/task");

var _health = require("./health");

var _get_health = require("./health/get_health");

var _alerting_authorization_client_factory = require("./alerting_authorization_client_factory");

var _get_security_health = require("./lib/get_security_health");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const EVENT_LOG_PROVIDER = 'alerting';
exports.EVENT_LOG_PROVIDER = EVENT_LOG_PROVIDER;
const EVENT_LOG_ACTIONS = {
  execute: 'execute',
  executeStart: 'execute-start',
  executeAction: 'execute-action',
  newInstance: 'new-instance',
  recoveredInstance: 'recovered-instance',
  activeInstance: 'active-instance',
  executeTimeout: 'execute-timeout'
};
exports.EVENT_LOG_ACTIONS = EVENT_LOG_ACTIONS;
const LEGACY_EVENT_LOG_ACTIONS = {
  resolvedInstance: 'resolved-instance'
};
exports.LEGACY_EVENT_LOG_ACTIONS = LEGACY_EVENT_LOG_ACTIONS;

class AlertingPlugin {
  constructor(initializerContext) {
    (0, _defineProperty2.default)(this, "config", void 0);
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "ruleTypeRegistry", void 0);
    (0, _defineProperty2.default)(this, "taskRunnerFactory", void 0);
    (0, _defineProperty2.default)(this, "licenseState", null);
    (0, _defineProperty2.default)(this, "isESOCanEncrypt", void 0);
    (0, _defineProperty2.default)(this, "security", void 0);
    (0, _defineProperty2.default)(this, "rulesClientFactory", void 0);
    (0, _defineProperty2.default)(this, "alertingAuthorizationClientFactory", void 0);
    (0, _defineProperty2.default)(this, "telemetryLogger", void 0);
    (0, _defineProperty2.default)(this, "kibanaVersion", void 0);
    (0, _defineProperty2.default)(this, "eventLogService", void 0);
    (0, _defineProperty2.default)(this, "eventLogger", void 0);
    (0, _defineProperty2.default)(this, "kibanaBaseUrl", void 0);
    (0, _defineProperty2.default)(this, "usageCounter", void 0);
    (0, _defineProperty2.default)(this, "createRouteHandlerContext", core => {
      const {
        ruleTypeRegistry,
        rulesClientFactory
      } = this;
      return async function alertsRouteHandlerContext(context, request) {
        const [{
          savedObjects
        }] = await core.getStartServices();
        return {
          getRulesClient: () => {
            return rulesClientFactory.create(request, savedObjects);
          },
          listTypes: ruleTypeRegistry.list.bind(ruleTypeRegistry),
          getFrameworkHealth: async () => await (0, _get_health.getHealth)(savedObjects.createInternalRepository(['alert'])),
          areApiKeysEnabled: async () => {
            var _security$authc$apiKe;

            const [, {
              security
            }] = await core.getStartServices();
            return (_security$authc$apiKe = security === null || security === void 0 ? void 0 : security.authc.apiKeys.areAPIKeysEnabled()) !== null && _security$authc$apiKe !== void 0 ? _security$authc$apiKe : false;
          }
        };
      };
    });
    this.config = initializerContext.config.create().pipe((0, _operators.first)()).toPromise();
    this.logger = initializerContext.logger.get();
    this.taskRunnerFactory = new _task_runner.TaskRunnerFactory();
    this.rulesClientFactory = new _rules_client_factory.RulesClientFactory();
    this.alertingAuthorizationClientFactory = new _alerting_authorization_client_factory.AlertingAuthorizationClientFactory();
    this.telemetryLogger = initializerContext.logger.get('usage');
    this.kibanaVersion = initializerContext.env.packageInfo.version;
  }

  setup(core, plugins) {
    var _plugins$usageCollect;

    const kibanaIndex = core.savedObjects.getKibanaIndex();
    this.kibanaBaseUrl = core.http.basePath.publicBaseUrl;
    this.licenseState = new _license_state.LicenseState(plugins.licensing.license$);
    this.security = plugins.security;
    core.capabilities.registerProvider(() => {
      return {
        management: {
          insightsAndAlerting: {
            triggersActions: true
          }
        }
      };
    });
    this.isESOCanEncrypt = plugins.encryptedSavedObjects.canEncrypt;

    if (!this.isESOCanEncrypt) {
      this.logger.warn('APIs are disabled because the Encrypted Saved Objects plugin is missing encryption key. Please set xpack.encryptedSavedObjects.encryptionKey in the kibana.yml or use the bin/kibana-encryption-keys command.');
    }

    this.eventLogger = plugins.eventLog.getLogger({
      event: {
        provider: EVENT_LOG_PROVIDER
      }
    });
    this.eventLogService = plugins.eventLog;
    plugins.eventLog.registerProviderActions(EVENT_LOG_PROVIDER, Object.values(EVENT_LOG_ACTIONS));
    const ruleTypeRegistry = new _rule_type_registry.RuleTypeRegistry({
      taskManager: plugins.taskManager,
      taskRunnerFactory: this.taskRunnerFactory,
      licenseState: this.licenseState,
      licensing: plugins.licensing
    });
    this.ruleTypeRegistry = ruleTypeRegistry;
    const usageCollection = plugins.usageCollection;

    if (usageCollection) {
      (0, _usage.registerAlertingUsageCollector)(usageCollection, core.getStartServices().then(([_, {
        taskManager
      }]) => taskManager));
      const eventLogIndex = this.eventLogService.getIndexPattern();
      (0, _task.initializeAlertingTelemetry)(this.telemetryLogger, core, plugins.taskManager, kibanaIndex, eventLogIndex);
    } // Usage counter for telemetry


    this.usageCounter = (_plugins$usageCollect = plugins.usageCollection) === null || _plugins$usageCollect === void 0 ? void 0 : _plugins$usageCollect.createUsageCounter(_types.ALERTS_FEATURE_ID);
    (0, _saved_objects.setupSavedObjects)(core.savedObjects, plugins.encryptedSavedObjects, this.ruleTypeRegistry, this.logger, plugins.actions.isPreconfiguredConnector);
    (0, _task2.initializeApiKeyInvalidator)(this.logger, core.getStartServices(), plugins.taskManager, this.config);
    const serviceStatus$ = new _rxjs.BehaviorSubject({
      level: _server.ServiceStatusLevels.available,
      summary: 'Alerting is (probably) ready'
    });
    core.status.set(serviceStatus$);
    (0, _health.initializeAlertingHealth)(this.logger, plugins.taskManager, core.getStartServices());
    core.http.registerRouteHandlerContext('alerting', this.createRouteHandlerContext(core)); // Routes

    const router = core.http.createRouter(); // Register routes

    (0, _routes.defineRoutes)({
      router,
      licenseState: this.licenseState,
      usageCounter: this.usageCounter,
      encryptedSavedObjects: plugins.encryptedSavedObjects
    });
    const alertingConfig = this.config;
    return {
      registerType(ruleType) {
        if (!(ruleType.minimumLicenseRequired in _server2.LICENSE_TYPE)) {
          throw new Error(`"${ruleType.minimumLicenseRequired}" is not a valid license type`);
        }

        alertingConfig.then(config => {
          var _ruleType$ruleTaskTim, _ruleType$cancelAlert;

          ruleType.ruleTaskTimeout = (_ruleType$ruleTaskTim = ruleType.ruleTaskTimeout) !== null && _ruleType$ruleTaskTim !== void 0 ? _ruleType$ruleTaskTim : config.defaultRuleTaskTimeout;
          ruleType.cancelAlertsOnRuleTimeout = (_ruleType$cancelAlert = ruleType.cancelAlertsOnRuleTimeout) !== null && _ruleType$cancelAlert !== void 0 ? _ruleType$cancelAlert : config.cancelAlertsOnRuleTimeout;
          ruleTypeRegistry.register(ruleType);
        });
      },

      getSecurityHealth: async () => {
        return await (0, _get_security_health.getSecurityHealth)(async () => this.licenseState ? this.licenseState.getIsSecurityEnabled() : null, async () => plugins.encryptedSavedObjects.canEncrypt, async () => {
          var _security$authc$apiKe2;

          const [, {
            security
          }] = await core.getStartServices();
          return (_security$authc$apiKe2 = security === null || security === void 0 ? void 0 : security.authc.apiKeys.areAPIKeysEnabled()) !== null && _security$authc$apiKe2 !== void 0 ? _security$authc$apiKe2 : false;
        });
      }
    };
  }

  start(core, plugins) {
    const {
      isESOCanEncrypt,
      logger,
      taskRunnerFactory,
      ruleTypeRegistry,
      rulesClientFactory,
      alertingAuthorizationClientFactory,
      security,
      licenseState
    } = this;
    licenseState === null || licenseState === void 0 ? void 0 : licenseState.setNotifyUsage(plugins.licensing.featureUsage.notifyUsage);
    const encryptedSavedObjectsClient = plugins.encryptedSavedObjects.getClient({
      includedHiddenTypes: ['alert']
    });

    const spaceIdToNamespace = spaceId => {
      return plugins.spaces && spaceId ? plugins.spaces.spacesService.spaceIdToNamespace(spaceId) : undefined;
    };

    alertingAuthorizationClientFactory.initialize({
      ruleTypeRegistry: ruleTypeRegistry,
      securityPluginSetup: security,
      securityPluginStart: plugins.security,

      async getSpace(request) {
        var _plugins$spaces;

        return (_plugins$spaces = plugins.spaces) === null || _plugins$spaces === void 0 ? void 0 : _plugins$spaces.spacesService.getActiveSpace(request);
      },

      getSpaceId(request) {
        var _plugins$spaces2;

        return (_plugins$spaces2 = plugins.spaces) === null || _plugins$spaces2 === void 0 ? void 0 : _plugins$spaces2.spacesService.getSpaceId(request);
      },

      features: plugins.features
    });
    rulesClientFactory.initialize({
      ruleTypeRegistry: ruleTypeRegistry,
      logger,
      taskManager: plugins.taskManager,
      securityPluginSetup: security,
      securityPluginStart: plugins.security,
      encryptedSavedObjectsClient,
      spaceIdToNamespace,

      getSpaceId(request) {
        var _plugins$spaces3;

        return (_plugins$spaces3 = plugins.spaces) === null || _plugins$spaces3 === void 0 ? void 0 : _plugins$spaces3.spacesService.getSpaceId(request);
      },

      actions: plugins.actions,
      eventLog: plugins.eventLog,
      kibanaVersion: this.kibanaVersion,
      authorization: alertingAuthorizationClientFactory,
      eventLogger: this.eventLogger
    });

    const getRulesClientWithRequest = request => {
      if (isESOCanEncrypt !== true) {
        throw new Error(`Unable to create alerts client because the Encrypted Saved Objects plugin is missing encryption key. Please set xpack.encryptedSavedObjects.encryptionKey in the kibana.yml or use the bin/kibana-encryption-keys command.`);
      }

      return rulesClientFactory.create(request, core.savedObjects);
    };

    const getAlertingAuthorizationWithRequest = request => {
      return alertingAuthorizationClientFactory.create(request);
    };

    this.config.then(config => {
      taskRunnerFactory.initialize({
        logger,
        getServices: this.getServicesFactory(core.savedObjects, core.elasticsearch),
        getRulesClientWithRequest,
        spaceIdToNamespace,
        actionsPlugin: plugins.actions,
        encryptedSavedObjectsClient,
        basePathService: core.http.basePath,
        eventLogger: this.eventLogger,
        internalSavedObjectsRepository: core.savedObjects.createInternalRepository(['alert']),
        executionContext: core.executionContext,
        ruleTypeRegistry: this.ruleTypeRegistry,
        kibanaBaseUrl: this.kibanaBaseUrl,
        supportsEphemeralTasks: plugins.taskManager.supportsEphemeralTasks(),
        maxEphemeralActionsPerRule: config.maxEphemeralActionsPerAlert,
        cancelAlertsOnRuleTimeout: config.cancelAlertsOnRuleTimeout,
        usageCounter: this.usageCounter
      });
    });
    this.eventLogService.registerSavedObjectProvider('alert', request => {
      const client = getRulesClientWithRequest(request);
      return objects => objects ? Promise.all(objects.map(async objectItem => await client.get({
        id: objectItem.id
      }))) : Promise.resolve([]);
    });
    this.eventLogService.isEsContextReady().then(() => {
      (0, _task.scheduleAlertingTelemetry)(this.telemetryLogger, plugins.taskManager);
    });
    (0, _health.scheduleAlertingHealthCheck)(this.logger, this.config, plugins.taskManager);
    (0, _task2.scheduleApiKeyInvalidatorTask)(this.telemetryLogger, this.config, plugins.taskManager);
    return {
      listTypes: ruleTypeRegistry.list.bind(this.ruleTypeRegistry),
      getAlertingAuthorizationWithRequest,
      getRulesClientWithRequest,
      getFrameworkHealth: async () => await (0, _get_health.getHealth)(core.savedObjects.createInternalRepository(['alert']))
    };
  }

  getServicesFactory(savedObjects, elasticsearch) {
    return request => ({
      savedObjectsClient: this.getScopedClientWithAlertSavedObjectType(savedObjects, request),
      scopedClusterClient: elasticsearch.client.asScoped(request)
    });
  }

  getScopedClientWithAlertSavedObjectType(savedObjects, request) {
    return savedObjects.getScopedClient(request, {
      includedHiddenTypes: ['alert', 'action']
    });
  }

  stop() {
    if (this.licenseState) {
      this.licenseState.clean();
    }
  }

}

exports.AlertingPlugin = AlertingPlugin;