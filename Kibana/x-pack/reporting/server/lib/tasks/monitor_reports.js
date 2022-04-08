"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MonitorReportsTask = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _moment = _interopRequireDefault(require("moment"));

var _schema_utils = require("../../../common/schema_utils");

var _statuses = require("../statuses");

var _store = require("../store");

var _ = require("./");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 * Task for finding the ReportingRecords left in the ReportingStore (.reporting index) and stuck in
 * a pending or processing status.
 *
 *  Stuck in pending:
 *    - This can happen if the report was scheduled in an earlier version of Kibana that used ESQueue.
 *    - Task Manager doesn't know about these types of reports because there was never a task
 *      scheduled for them.
 *  Stuck in processing:
 *    - This can could happen if the server crashed while a report was executing.
 *    - Task Manager doesn't know about these reports, because the task is completed in Task
 *      Manager when Reporting starts executing the report. We are not using Task Manager's retry
 *      mechanisms, which defer the retry for a few minutes.
 *
 * These events require us to reschedule the report with Task Manager, so that the jobs can be
 * distributed and executed.
 *
 * The runner function reschedules a single report job per task run, to avoid flooding Task Manager
 * in case many report jobs need to be recovered.
 */


class MonitorReportsTask {
  constructor(reporting, config, parentLogger) {
    (0, _defineProperty2.default)(this, "TYPE", _.REPORTING_MONITOR_TYPE);
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "taskManagerStart", void 0);
    (0, _defineProperty2.default)(this, "store", void 0);
    (0, _defineProperty2.default)(this, "timeout", void 0);
    this.reporting = reporting;
    this.config = config;
    this.logger = parentLogger.clone([_.REPORTING_MONITOR_TYPE]);
    this.timeout = (0, _schema_utils.numberToDuration)(config.queue.timeout);
  }

  async getStore() {
    if (this.store) {
      return this.store;
    }

    const {
      store
    } = await this.reporting.getPluginStartDeps();
    this.store = store;
    return store;
  }

  async init(taskManager) {
    this.taskManagerStart = taskManager; // Round the interval up to the nearest second since Task Manager doesn't
    // support milliseconds

    const scheduleInterval = Math.ceil((0, _schema_utils.numberToDuration)(this.config.queue.pollInterval).asSeconds()) + 's';
    this.logger.debug(`Task to monitor for pending reports to run every ${scheduleInterval}.`);
    await taskManager.ensureScheduled({
      id: this.TYPE,
      taskType: this.TYPE,
      schedule: {
        interval: scheduleInterval
      },
      state: {},
      params: {}
    });
  }

  getTaskRunner() {
    return () => {
      return {
        run: async () => {
          const reportingStore = await this.getStore();

          try {
            const recoveredJob = await reportingStore.findStaleReportJob();

            if (!recoveredJob) {
              // no reports need to be rescheduled
              return;
            }

            const {
              _id: jobId,
              _source: {
                process_expiration: processExpiration,
                status
              }
            } = recoveredJob;

            if (![_statuses.statuses.JOB_STATUS_PENDING, _statuses.statuses.JOB_STATUS_PROCESSING].includes(status)) {
              throw new Error(`Invalid job status in the monitoring search result: ${status}`); // only pending or processing jobs possibility need rescheduling
            }

            if (status === _statuses.statuses.JOB_STATUS_PENDING) {
              this.logger.info(`${jobId} was scheduled in a previous version and left in [${status}] status. Rescheduling...`);
            }

            if (status === _statuses.statuses.JOB_STATUS_PROCESSING) {
              const expirationTime = (0, _moment.default)(processExpiration);
              const overdueValue = (0, _moment.default)().valueOf() - expirationTime.valueOf();
              this.logger.info(`${jobId} status is [${status}] and the expiration time was [${overdueValue}ms] ago. Rescheduling...`);
            } // clear process expiration and set status to pending


            const report = new _store.SavedReport({ ...recoveredJob,
              ...recoveredJob._source
            });
            await reportingStore.prepareReportForRetry(report); // if there is a version conflict response, this just throws and logs an error
            // clear process expiration and reschedule

            await this.rescheduleTask(report.toReportTaskJSON(), this.logger); // a recovered report job must be scheduled by only a sinle Kibana instance
          } catch (err) {
            this.logger.error(err);
          }

          return;
        },
        cancel: async () => ({
          state: {}
        })
      };
    };
  }

  getTaskDefinition() {
    return {
      type: _.REPORTING_MONITOR_TYPE,
      title: 'Reporting: monitor jobs',
      createTaskRunner: this.getTaskRunner(),
      maxAttempts: 1,
      // round the timeout value up to the nearest second, since Task Manager
      // doesn't support milliseconds or > 1s
      timeout: Math.ceil(this.timeout.asSeconds()) + 's'
    };
  } // reschedule the task with TM


  async rescheduleTask(task, logger) {
    if (!this.taskManagerStart) {
      throw new Error('Reporting task runner has not been initialized!');
    }

    logger.info(`Rescheduling task:${task.id} to retry.`);
    const newTask = await this.reporting.scheduleTask(task);
    this.reporting.getEventLogger({
      _id: task.id,
      ...task
    }, newTask).logRetry();
    return newTask;
  }

  getStatus() {
    if (this.taskManagerStart) {
      return _.ReportingTaskStatus.INITIALIZED;
    }

    return _.ReportingTaskStatus.UNINITIALIZED;
  }

}

exports.MonitorReportsTask = MonitorReportsTask;