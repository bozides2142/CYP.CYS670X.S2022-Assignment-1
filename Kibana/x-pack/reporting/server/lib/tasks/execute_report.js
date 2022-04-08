"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExecuteReportTask = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _moment = _interopRequireDefault(require("moment"));

var Rx = _interopRequireWildcard(require("rxjs"));

var _operators = require("rxjs/operators");

var _stream = require("stream");

var _util = require("util");

var _ = require("../");

var _cancellation_token = require("../../../common/cancellation_token");

var _schema_utils = require("../../../common/schema_utils");

var _store = require("../store");

var _2 = require("./");

var _error_logger = require("./error_logger");

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== "function") return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function (nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache(nodeInterop);

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function isOutput(output) {
  return output.size != null;
}

function reportFromTask(task) {
  return new _store.Report({ ...task,
    _id: task.id,
    _index: task.index
  });
}

class ExecuteReportTask {
  constructor(reporting, config, logger) {
    (0, _defineProperty2.default)(this, "TYPE", _2.REPORTING_EXECUTE_TYPE);
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "taskManagerStart", void 0);
    (0, _defineProperty2.default)(this, "taskExecutors", void 0);
    (0, _defineProperty2.default)(this, "kibanaId", void 0);
    (0, _defineProperty2.default)(this, "kibanaName", void 0);
    (0, _defineProperty2.default)(this, "store", void 0);
    this.reporting = reporting;
    this.config = config;
    this.logger = logger.clone(['runTask']);
  }
  /*
   * To be called from plugin start
   */


  async init(taskManager) {
    this.taskManagerStart = taskManager;
    const {
      reporting
    } = this;
    const exportTypesRegistry = reporting.getExportTypesRegistry();
    const executors = new Map();

    for (const exportType of exportTypesRegistry.getAll()) {
      const exportTypeLogger = this.logger.clone([exportType.id]);
      const jobExecutor = exportType.runTaskFnFactory(reporting, exportTypeLogger); // The task will run the function with the job type as a param.
      // This allows us to retrieve the specific export type runFn when called to run an export

      executors.set(exportType.jobType, {
        jobExecutor,
        jobContentEncoding: exportType.jobContentEncoding
      });
    }

    this.taskExecutors = executors;
    const config = reporting.getConfig();
    this.kibanaId = config.kbnConfig.get('server', 'uuid');
    this.kibanaName = config.kbnConfig.get('server', 'name');
  }
  /*
   * Async get the ReportingStore: it is only available after PluginStart
   */


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

  getTaskManagerStart() {
    if (!this.taskManagerStart) {
      throw new Error('Reporting task runner has not been initialized!');
    }

    return this.taskManagerStart;
  }

  getJobContentEncoding(jobType) {
    var _this$taskExecutors, _this$taskExecutors$g;

    return (_this$taskExecutors = this.taskExecutors) === null || _this$taskExecutors === void 0 ? void 0 : (_this$taskExecutors$g = _this$taskExecutors.get(jobType)) === null || _this$taskExecutors$g === void 0 ? void 0 : _this$taskExecutors$g.jobContentEncoding;
  }

  async _claimJob(task) {
    if (this.kibanaId == null) {
      throw new Error(`Kibana instance ID is undefined!`);
    }

    if (this.kibanaName == null) {
      throw new Error(`Kibana instance name is undefined!`);
    }

    const store = await this.getStore();
    const report = await store.findReportFromTask(task); // receives seq_no and primary_term
    // Check if this is a completed job. This may happen if the `reports:monitor`
    // task detected it to be a zombie job and rescheduled it, but it
    // eventually completed on its own.

    if (report.status === 'completed') {
      throw new Error(`Can not claim the report job: it is already completed!`);
    }

    const m = (0, _moment.default)(); // check if job has exceeded the configured maxAttempts

    const maxAttempts = this.config.capture.maxAttempts;

    if (report.attempts >= maxAttempts) {
      const err = new Error(`Max attempts reached (${maxAttempts}). Queue timeout reached.`);
      await this._failJob(report, err);
      throw err;
    }

    const queueTimeout = (0, _schema_utils.durationToNumber)(this.config.queue.timeout);
    const startTime = m.toISOString();
    const expirationTime = m.add(queueTimeout).toISOString();
    const doc = {
      kibana_id: this.kibanaId,
      kibana_name: this.kibanaName,
      attempts: report.attempts + 1,
      max_attempts: maxAttempts,
      started_at: startTime,
      timeout: queueTimeout,
      process_expiration: expirationTime
    };
    const claimedReport = new _store.SavedReport({ ...report,
      ...doc
    });
    this.logger.debug(`Claiming ${claimedReport.jobtype} ${report._id} ` + `[_index: ${report._index}]  ` + `[_seq_no: ${report._seq_no}]  ` + `[_primary_term: ${report._primary_term}]  ` + `[attempts: ${report.attempts}]  ` + `[process_expiration: ${expirationTime}]`);
    const resp = await store.setReportClaimed(claimedReport, doc);
    claimedReport._seq_no = resp._seq_no;
    claimedReport._primary_term = resp._primary_term;
    return claimedReport;
  }

  async _failJob(report, error) {
    var _docOutput;

    const message = `Failing ${report.jobtype} job ${report._id}`; // log the error

    let docOutput;

    if (error) {
      (0, _error_logger.errorLogger)(this.logger, message, error);
      docOutput = this._formatOutput(error);
    } else {
      (0, _error_logger.errorLogger)(this.logger, message);
    } // update the report in the store


    const store = await this.getStore();
    const completedTime = (0, _moment.default)().toISOString();
    const doc = {
      completed_at: completedTime,
      output: (_docOutput = docOutput) !== null && _docOutput !== void 0 ? _docOutput : null
    };
    return await store.setReportFailed(report, doc);
  }

  _formatOutput(output) {
    const docOutput = {};
    const unknownMime = null;

    if (isOutput(output)) {
      docOutput.content_type = output.content_type || unknownMime;
      docOutput.max_size_reached = output.max_size_reached;
      docOutput.csv_contains_formulas = output.csv_contains_formulas;
      docOutput.size = output.size;
      docOutput.warnings = output.warnings && output.warnings.length > 0 ? output.warnings : undefined;
    } else {
      const defaultOutput = null;
      docOutput.content = output.toString() || defaultOutput;
      docOutput.content_type = unknownMime;
      docOutput.warnings = [output.toString()];
    }

    return docOutput;
  }

  async _performJob(task, cancellationToken, stream) {
    if (!this.taskExecutors) {
      throw new Error(`Task run function factories have not been called yet!`);
    } // get the run_task function


    const runner = this.taskExecutors.get(task.jobtype);

    if (!runner) {
      throw new Error(`No defined task runner function for ${task.jobtype}!`);
    } // run the report
    // if workerFn doesn't finish before timeout, call the cancellationToken and throw an error


    const queueTimeout = (0, _schema_utils.durationToNumber)(this.config.queue.timeout);
    return Rx.from(runner.jobExecutor(task.id, task.payload, cancellationToken, stream)).pipe((0, _operators.timeout)(queueTimeout)) // throw an error if a value is not emitted before timeout
    .toPromise();
  }

  async _completeJob(report, output) {
    let docId = `/${report._index}/_doc/${report._id}`;
    this.logger.debug(`Saving ${report.jobtype} to ${docId}.`);
    const completedTime = (0, _moment.default)().toISOString();

    const docOutput = this._formatOutput(output);

    const store = await this.getStore();
    const doc = {
      completed_at: completedTime,
      output: docOutput
    };
    docId = `/${report._index}/_doc/${report._id}`;
    const resp = await store.setReportCompleted(report, doc);
    this.logger.info(`Saved ${report.jobtype} job ${docId}`);
    report._seq_no = resp._seq_no;
    report._primary_term = resp._primary_term;
    return report;
  }
  /*
   * Provides a TaskRunner for Task Manager
   */


  getTaskRunner() {
    // Keep a separate local stack for each task run
    return context => {
      let jobId;
      const cancellationToken = new _cancellation_token.CancellationToken();
      return {
        /*
         * Runs a reporting job
         * Claim job: Finds the report in ReportingStore, updates it to "processing"
         * Perform job: Gets the export type's runner, runs it with the job params
         * Complete job: Updates the report in ReportStore with the output from the runner
         * If any error happens, additional retry attempts may be picked up by a separate instance
         */
        run: async () => {
          let report; // find the job in the store and set status to processing

          const task = context.taskInstance.params;
          jobId = task === null || task === void 0 ? void 0 : task.id;

          try {
            if (!jobId) {
              throw new Error('Invalid report data provided in scheduled task!');
            }

            this.reporting.trackReport(jobId); // Update job status to claimed

            report = await this._claimJob(task);
          } catch (failedToClaim) {
            // error claiming report - log the error
            // could be version conflict, or no longer connected to ES
            (0, _error_logger.errorLogger)(this.logger, `Error in claiming ${jobId}`, failedToClaim);
          }

          if (!report) {
            this.reporting.untrackReport(jobId);
            (0, _error_logger.errorLogger)(this.logger, `Job ${jobId} could not be claimed. Exiting...`);
            return;
          }

          const {
            jobtype: jobType,
            attempts
          } = report;
          const maxAttempts = this.config.capture.maxAttempts;
          this.logger.debug(`Starting ${jobType} report ${jobId}: attempt ${attempts} of ${maxAttempts}.`);
          this.logger.debug(`Reports running: ${this.reporting.countConcurrentReports()}.`);
          const eventLog = this.reporting.getEventLogger(new _store.Report({ ...task,
            _id: task.id,
            _index: task.index
          }));

          try {
            const jobContentEncoding = this.getJobContentEncoding(jobType);
            const stream = await (0, _.getContentStream)(this.reporting, {
              id: report._id,
              index: report._index,
              if_primary_term: report._primary_term,
              if_seq_no: report._seq_no
            }, {
              encoding: jobContentEncoding === 'base64' ? 'base64' : 'raw'
            });
            eventLog.logExecutionStart();
            const output = await this._performJob(task, cancellationToken, stream);
            stream.end();
            await (0, _util.promisify)(_stream.finished)(stream, {
              readable: false
            });
            report._seq_no = stream.getSeqNo();
            report._primary_term = stream.getPrimaryTerm();
            eventLog.logExecutionComplete({
              byteSize: stream.bytesWritten
            });

            if (output) {
              this.logger.debug(`Job output size: ${stream.bytesWritten} bytes.`);
              report = await this._completeJob(report, { ...output,
                size: stream.bytesWritten
              });
            } // untrack the report for concurrency awareness


            this.logger.debug(`Stopping ${jobId}.`);
          } catch (failedToExecuteErr) {
            eventLog.logError(failedToExecuteErr);
            cancellationToken.cancel();

            if (attempts < maxAttempts) {
              // attempts remain, reschedule
              try {
                if (report == null) {
                  throw new Error(`Report ${jobId} is null!`);
                } // reschedule to retry


                const remainingAttempts = maxAttempts - report.attempts;
                (0, _error_logger.errorLogger)(this.logger, `Scheduling retry for job ${jobId}. Retries remaining: ${remainingAttempts}.`, failedToExecuteErr);
                await this.rescheduleTask(reportFromTask(task).toReportTaskJSON(), this.logger);
              } catch (rescheduleErr) {
                // can not be rescheduled - log the error
                (0, _error_logger.errorLogger)(this.logger, `Could not reschedule the errored job ${jobId}!`, rescheduleErr);
              }
            } else {
              // 0 attempts remain - fail the job
              try {
                const maxAttemptsMsg = `Max attempts (${attempts}) reached for job ${jobId}. Failed with: ${failedToExecuteErr}`;

                if (report == null) {
                  throw new Error(`Report ${jobId} is null!`);
                }

                const resp = await this._failJob(report, new Error(maxAttemptsMsg));
                report._seq_no = resp._seq_no;
                report._primary_term = resp._primary_term;
              } catch (failedToFailError) {
                (0, _error_logger.errorLogger)(this.logger, `Could not fail ${jobId}!`, failedToFailError);
              }
            }
          } finally {
            this.reporting.untrackReport(jobId);
            this.logger.debug(`Reports running: ${this.reporting.countConcurrentReports()}.`);
          }
        },

        /*
         * Called by Task Manager to stop the report execution process in case
         * of timeout or server shutdown
         */
        cancel: async () => {
          if (jobId) {
            this.logger.warn(`Cancelling job ${jobId}...`);
          }

          cancellationToken.cancel();
        }
      };
    };
  }

  getTaskDefinition() {
    // round up from ms to the nearest second
    const queueTimeout = Math.ceil((0, _schema_utils.numberToDuration)(this.config.queue.timeout).asSeconds()) + 's';
    const maxConcurrency = this.config.queue.pollEnabled ? 1 : 0;
    return {
      type: _2.REPORTING_EXECUTE_TYPE,
      title: 'Reporting: execute job',
      createTaskRunner: this.getTaskRunner(),
      maxAttempts: 1,
      // NOTE: not using Task Manager retries
      timeout: queueTimeout,
      maxConcurrency
    };
  }

  async scheduleTask(params) {
    const taskInstance = {
      taskType: _2.REPORTING_EXECUTE_TYPE,
      state: {},
      params
    };
    return await this.getTaskManagerStart().schedule(taskInstance);
  }

  async rescheduleTask(task, logger) {
    logger.info(`Rescheduling task:${task.id} to retry after error.`);
    const oldTaskInstance = {
      taskType: _2.REPORTING_EXECUTE_TYPE,
      state: {},
      params: task
    };
    const newTask = await this.getTaskManagerStart().schedule(oldTaskInstance);
    logger.debug(`Rescheduled task:${task.id}. New task: task:${newTask.id}`);
    return newTask;
  }

  getStatus() {
    if (this.taskManagerStart) {
      return _2.ReportingTaskStatus.INITIALIZED;
    }

    return _2.ReportingTaskStatus.UNINITIALIZED;
  }

}

exports.ExecuteReportTask = ExecuteReportTask;