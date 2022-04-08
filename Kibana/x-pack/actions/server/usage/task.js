"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TELEMETRY_TASK_TYPE = exports.TASK_ID = void 0;
exports.initializeActionsTelemetry = initializeActionsTelemetry;
exports.scheduleActionsTelemetry = scheduleActionsTelemetry;
exports.telemetryTaskRunner = telemetryTaskRunner;

var _moment = _interopRequireDefault(require("moment"));

var _actions_telemetry = require("./actions_telemetry");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const TELEMETRY_TASK_TYPE = 'actions_telemetry';
exports.TELEMETRY_TASK_TYPE = TELEMETRY_TASK_TYPE;
const TASK_ID = `Actions-${TELEMETRY_TASK_TYPE}`;
exports.TASK_ID = TASK_ID;

function initializeActionsTelemetry(logger, taskManager, core, kibanaIndex, preconfiguredActions, eventLogIndex) {
  registerActionsTelemetryTask(logger, taskManager, core, kibanaIndex, preconfiguredActions, eventLogIndex);
}

function scheduleActionsTelemetry(logger, taskManager) {
  scheduleTasks(logger, taskManager);
}

function registerActionsTelemetryTask(logger, taskManager, core, kibanaIndex, preconfiguredActions, eventLogIndex) {
  taskManager.registerTaskDefinitions({
    [TELEMETRY_TASK_TYPE]: {
      title: 'Actions usage fetch task',
      timeout: '5m',
      createTaskRunner: telemetryTaskRunner(logger, core, kibanaIndex, preconfiguredActions, eventLogIndex)
    }
  });
}

async function scheduleTasks(logger, taskManager) {
  try {
    await taskManager.ensureScheduled({
      id: TASK_ID,
      taskType: TELEMETRY_TASK_TYPE,
      state: {},
      params: {}
    });
  } catch (e) {
    logger.debug(`Error scheduling task, received ${e.message}`);
  }
}

function telemetryTaskRunner(logger, core, kibanaIndex, preconfiguredActions, eventLogIndex) {
  return ({
    taskInstance
  }) => {
    const {
      state
    } = taskInstance;

    const getEsClient = () => core.getStartServices().then(([{
      elasticsearch: {
        client
      }
    }]) => client.asInternalUser);

    return {
      async run() {
        const esClient = await getEsClient();
        return Promise.all([(0, _actions_telemetry.getTotalCount)(esClient, kibanaIndex, preconfiguredActions), (0, _actions_telemetry.getInUseTotalCount)(esClient, kibanaIndex, undefined, preconfiguredActions), (0, _actions_telemetry.getExecutionsPerDayCount)(esClient, eventLogIndex)]).then(([totalAggegations, totalInUse, totalExecutionsPerDay]) => {
          return {
            state: {
              runs: (state.runs || 0) + 1,
              count_total: totalAggegations.countTotal,
              count_by_type: totalAggegations.countByType,
              count_active_total: totalInUse.countTotal,
              count_active_by_type: totalInUse.countByType,
              count_active_alert_history_connectors: totalInUse.countByAlertHistoryConnectorType,
              count_active_email_connectors_by_service_type: totalInUse.countEmailByService,
              count_actions_namespaces: totalInUse.countNamespaces,
              count_actions_executions_per_day: totalExecutionsPerDay.countTotal,
              count_actions_executions_by_type_per_day: totalExecutionsPerDay.countByType,
              count_actions_executions_failed_per_day: totalExecutionsPerDay.countFailed,
              count_actions_executions_failed_by_type_per_day: totalExecutionsPerDay.countFailedByType,
              avg_execution_time_per_day: totalExecutionsPerDay.avgExecutionTime,
              avg_execution_time_by_type_per_day: totalExecutionsPerDay.avgExecutionTimeByType
            },
            runAt: getNextMidnight()
          };
        }).catch(errMsg => {
          logger.warn(`Error executing actions telemetry task: ${errMsg}`);
          return {
            state: {},
            runAt: getNextMidnight()
          };
        });
      }

    };
  };
}

function getNextMidnight() {
  return (0, _moment.default)().add(1, 'd').startOf('d').toDate();
}