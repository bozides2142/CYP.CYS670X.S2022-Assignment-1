"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TELEMETRY_TASK_TYPE = exports.TASK_ID = void 0;
exports.initializeAlertingTelemetry = initializeAlertingTelemetry;
exports.scheduleAlertingTelemetry = scheduleAlertingTelemetry;
exports.telemetryTaskRunner = telemetryTaskRunner;

var _moment = _interopRequireDefault(require("moment"));

var _alerting_telemetry = require("./alerting_telemetry");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const TELEMETRY_TASK_TYPE = 'alerting_telemetry';
exports.TELEMETRY_TASK_TYPE = TELEMETRY_TASK_TYPE;
const TASK_ID = `Alerting-${TELEMETRY_TASK_TYPE}`;
exports.TASK_ID = TASK_ID;

function initializeAlertingTelemetry(logger, core, taskManager, kibanaIndex, eventLogIndex) {
  registerAlertingTelemetryTask(logger, core, taskManager, kibanaIndex, eventLogIndex);
}

function scheduleAlertingTelemetry(logger, taskManager) {
  if (taskManager) {
    scheduleTasks(logger, taskManager);
  }
}

function registerAlertingTelemetryTask(logger, core, taskManager, kibanaIndex, eventLogIndex) {
  taskManager.registerTaskDefinitions({
    [TELEMETRY_TASK_TYPE]: {
      title: 'Alerting usage fetch task',
      timeout: '5m',
      createTaskRunner: telemetryTaskRunner(logger, core, kibanaIndex, eventLogIndex, taskManager.index)
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

function telemetryTaskRunner(logger, core, kibanaIndex, eventLogIndex, taskManagerIndex) {
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
        return Promise.all([(0, _alerting_telemetry.getTotalCountAggregations)(esClient, kibanaIndex), (0, _alerting_telemetry.getTotalCountInUse)(esClient, kibanaIndex), (0, _alerting_telemetry.getExecutionsPerDayCount)(esClient, eventLogIndex), (0, _alerting_telemetry.getExecutionTimeoutsPerDayCount)(esClient, eventLogIndex), (0, _alerting_telemetry.getFailedAndUnrecognizedTasksPerDay)(esClient, taskManagerIndex)]).then(([totalCountAggregations, totalInUse, dailyExecutionCounts, dailyExecutionTimeoutCounts, dailyFailedAndUnrecognizedTasks]) => {
          return {
            state: {
              runs: (state.runs || 0) + 1,
              ...totalCountAggregations,
              count_active_by_type: totalInUse.countByType,
              count_active_total: totalInUse.countTotal,
              count_disabled_total: totalCountAggregations.count_total - totalInUse.countTotal,
              count_rules_namespaces: totalInUse.countNamespaces,
              count_rules_executions_per_day: dailyExecutionCounts.countTotal,
              count_rules_executions_by_type_per_day: dailyExecutionCounts.countByType,
              count_rules_executions_failured_per_day: dailyExecutionCounts.countTotalFailures,
              count_rules_executions_failured_by_reason_per_day: dailyExecutionCounts.countFailuresByReason,
              count_rules_executions_failured_by_reason_by_type_per_day: dailyExecutionCounts.countFailuresByReasonByType,
              count_rules_executions_timeouts_per_day: dailyExecutionTimeoutCounts.countTotal,
              count_rules_executions_timeouts_by_type_per_day: dailyExecutionTimeoutCounts.countByType,
              count_failed_and_unrecognized_rule_tasks_per_day: dailyFailedAndUnrecognizedTasks.countTotal,
              count_failed_and_unrecognized_rule_tasks_by_status_per_day: dailyFailedAndUnrecognizedTasks.countByStatus,
              count_failed_and_unrecognized_rule_tasks_by_status_by_type_per_day: dailyFailedAndUnrecognizedTasks.countByStatusByRuleType,
              avg_execution_time_per_day: dailyExecutionCounts.avgExecutionTime,
              avg_execution_time_by_type_per_day: dailyExecutionCounts.avgExecutionTimeByType
            },
            runAt: getNextMidnight()
          };
        }).catch(errMsg => {
          logger.warn(`Error executing alerting telemetry task: ${errMsg}`);
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