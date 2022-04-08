"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createExecutionHandler = createExecutionHandler;

var _transform_action_params = require("./transform_action_params");

var _server = require("../../../actions/server");

var _server2 = require("../../../event_log/server");

var _plugin = require("../plugin");

var _inject_action_params = require("./inject_action_params");

var _server3 = require("../../../task_manager/server");

var _create_alert_event_log_record_object = require("../lib/create_alert_event_log_record_object");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function createExecutionHandler({
  logger,
  ruleId,
  ruleName,
  executionId,
  tags,
  actionsPlugin,
  actions: ruleActions,
  spaceId,
  apiKey,
  ruleType,
  kibanaBaseUrl,
  eventLogger,
  request,
  ruleParams,
  supportsEphemeralTasks,
  maxEphemeralActionsPerRule
}) {
  const ruleTypeActionGroups = new Map(ruleType.actionGroups.map(actionGroup => [actionGroup.id, actionGroup.name]));
  return async ({
    actionGroup,
    actionSubgroup,
    context,
    state,
    alertId
  }) => {
    const triggeredActions = [];

    if (!ruleTypeActionGroups.has(actionGroup)) {
      logger.error(`Invalid action group "${actionGroup}" for rule "${ruleType.id}".`);
      return triggeredActions;
    }

    const actions = ruleActions.filter(({
      group
    }) => group === actionGroup).map(action => {
      return { ...action,
        params: (0, _transform_action_params.transformActionParams)({
          actionsPlugin,
          alertId: ruleId,
          alertType: ruleType.id,
          actionTypeId: action.actionTypeId,
          alertName: ruleName,
          spaceId,
          tags,
          alertInstanceId: alertId,
          alertActionGroup: actionGroup,
          alertActionGroupName: ruleTypeActionGroups.get(actionGroup),
          alertActionSubgroup: actionSubgroup,
          context,
          actionParams: action.params,
          actionId: action.id,
          state,
          kibanaBaseUrl,
          alertParams: ruleParams
        })
      };
    }).map(action => ({ ...action,
      params: (0, _inject_action_params.injectActionParams)({
        ruleId,
        spaceId,
        actionParams: action.params,
        actionTypeId: action.actionTypeId
      })
    }));
    const ruleLabel = `${ruleType.id}:${ruleId}: '${ruleName}'`;
    const actionsClient = await actionsPlugin.getActionsClientWithRequest(request);
    let ephemeralActionsToSchedule = maxEphemeralActionsPerRule;

    for (const action of actions) {
      if (!actionsPlugin.isActionExecutable(action.id, action.actionTypeId, {
        notifyUsage: true
      })) {
        logger.warn(`Rule "${ruleId}" skipped scheduling action "${action.id}" because it is disabled`);
        continue;
      }

      const namespace = spaceId === 'default' ? {} : {
        namespace: spaceId
      };
      const enqueueOptions = {
        id: action.id,
        params: action.params,
        spaceId,
        apiKey: apiKey !== null && apiKey !== void 0 ? apiKey : null,
        source: (0, _server.asSavedObjectExecutionSource)({
          id: ruleId,
          type: 'alert'
        }),
        executionId,
        relatedSavedObjects: [{
          id: ruleId,
          type: 'alert',
          namespace: namespace.namespace,
          typeId: ruleType.id
        }]
      }; // TODO would be nice  to add the action name here, but it's not available

      const actionLabel = `${action.actionTypeId}:${action.id}`;

      if (supportsEphemeralTasks && ephemeralActionsToSchedule > 0) {
        ephemeralActionsToSchedule--;

        try {
          await actionsClient.ephemeralEnqueuedExecution(enqueueOptions);
        } catch (err) {
          if ((0, _server3.isEphemeralTaskRejectedDueToCapacityError)(err)) {
            await actionsClient.enqueueExecution(enqueueOptions);
          }
        } finally {
          triggeredActions.push(action);
        }
      } else {
        await actionsClient.enqueueExecution(enqueueOptions);
        triggeredActions.push(action);
      }

      const event = (0, _create_alert_event_log_record_object.createAlertEventLogRecordObject)({
        ruleId,
        ruleType: ruleType,
        action: _plugin.EVENT_LOG_ACTIONS.executeAction,
        executionId,
        instanceId: alertId,
        group: actionGroup,
        subgroup: actionSubgroup,
        ruleName,
        savedObjects: [{
          type: 'alert',
          id: ruleId,
          typeId: ruleType.id,
          relation: _server2.SAVED_OBJECT_REL_PRIMARY
        }, {
          type: 'action',
          id: action.id,
          typeId: action.actionTypeId
        }],
        ...namespace,
        message: `alert: ${ruleLabel} instanceId: '${alertId}' scheduled ${actionSubgroup ? `actionGroup(subgroup): '${actionGroup}(${actionSubgroup})'` : `actionGroup: '${actionGroup}'`} action: ${actionLabel}`
      });
      eventLogger.logEvent(event);
    }

    return triggeredActions;
  };
}