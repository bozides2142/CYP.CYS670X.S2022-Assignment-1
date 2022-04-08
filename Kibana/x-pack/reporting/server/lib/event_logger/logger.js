"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reportingEventLoggerFactory = reportingEventLoggerFactory;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _deepmerge = _interopRequireDefault(require("deepmerge"));

var _constants = require("../../../common/constants");

var _ = require("./");

var _adapter = require("./adapter");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/** @internal */


function reportingEventLoggerFactory(logger) {
  const genericLogger = new _adapter.EcsLogAdapter(logger, {
    event: {
      provider: _constants.PLUGIN_ID
    }
  });
  return class ReportingEventLogger {
    constructor(report, task) {
      (0, _defineProperty2.default)(this, "eventObj", void 0);
      (0, _defineProperty2.default)(this, "report", void 0);
      (0, _defineProperty2.default)(this, "task", void 0);
      (0, _defineProperty2.default)(this, "completionLogger", void 0);
      this.report = report;
      this.task = task;
      this.eventObj = {
        event: {
          timezone: report.payload.browserTimezone
        },
        kibana: {
          reporting: {
            id: report._id,
            jobType: report.jobtype
          },
          ...(task !== null && task !== void 0 && task.id ? {
            task: {
              id: task.id
            }
          } : undefined)
        },
        user: report.created_by ? {
          name: report.created_by
        } : undefined
      }; // create a "complete" logger that will use EventLog helpers to calculate timings

      this.completionLogger = new _adapter.EcsLogAdapter(logger, {
        event: {
          provider: _constants.PLUGIN_ID
        }
      });
    }

    logScheduleTask() {
      const message = `queued report ${this.report._id}`;
      const event = (0, _deepmerge.default)({
        message,
        kibana: {
          reporting: {
            actionType: _.ActionType.SCHEDULE_TASK
          }
        }
      }, this.eventObj);
      genericLogger.logEvent(message, event);
      return event;
    }

    logExecutionStart() {
      const message = `starting ${this.report.jobtype} execution`;
      this.completionLogger.startTiming();
      const event = (0, _deepmerge.default)({
        message,
        kibana: {
          reporting: {
            actionType: _.ActionType.EXECUTE_START
          }
        }
      }, this.eventObj);
      genericLogger.logEvent(message, event);
      return event;
    }

    logExecutionComplete({
      byteSize
    }) {
      const message = `completed ${this.report.jobtype} execution`;
      this.completionLogger.stopTiming();
      const event = (0, _deepmerge.default)({
        message,
        kibana: {
          reporting: {
            actionType: _.ActionType.EXECUTE_COMPLETE,
            byteSize
          }
        }
      }, this.eventObj);
      this.completionLogger.logEvent(message, event);
      return event;
    }

    logError(error) {
      const message = `an error occurred`;
      const logErrorMessage = {
        message,
        kibana: {
          reporting: {
            actionType: _.ActionType.EXECUTE_ERROR
          }
        },
        error: {
          message: error.message,
          code: error.code,
          stack_trace: error.stack_trace,
          type: error.type
        }
      };
      const event = (0, _deepmerge.default)(logErrorMessage, this.eventObj);
      genericLogger.logEvent(message, event);
      return event;
    }

    logClaimTask() {
      const message = `claimed report ${this.report._id}`;
      const event = (0, _deepmerge.default)({
        message,
        kibana: {
          reporting: {
            actionType: _.ActionType.CLAIM_TASK
          }
        }
      }, this.eventObj);
      genericLogger.logEvent(message, event);
      return event;
    }

    logReportFailure() {
      const message = `report ${this.report._id} has failed`;
      const event = (0, _deepmerge.default)({
        message,
        kibana: {
          reporting: {
            actionType: _.ActionType.FAIL_REPORT
          }
        }
      }, this.eventObj);
      genericLogger.logEvent(message, event);
      return event;
    }

    logReportSaved() {
      const message = `saved report ${this.report._id}`;
      const event = (0, _deepmerge.default)({
        message,
        kibana: {
          reporting: {
            actionType: _.ActionType.SAVE_REPORT
          }
        }
      }, this.eventObj);
      genericLogger.logEvent(message, event);
      return event;
    }

    logRetry() {
      const message = `scheduled retry for report ${this.report._id}`;
      const event = (0, _deepmerge.default)({
        message,
        kibana: {
          reporting: {
            actionType: _.ActionType.RETRY
          }
        }
      }, this.eventObj);
      genericLogger.logEvent(message, event);
      return event;
    }

  };
}