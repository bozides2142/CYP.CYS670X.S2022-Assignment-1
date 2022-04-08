"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "ExecuteReportTask", {
  enumerable: true,
  get: function () {
    return _execute_report.ExecuteReportTask;
  }
});
Object.defineProperty(exports, "MonitorReportsTask", {
  enumerable: true,
  get: function () {
    return _monitor_reports.MonitorReportsTask;
  }
});
exports.ReportingTaskStatus = exports.REPORTING_MONITOR_TYPE = exports.REPORTING_EXECUTE_TYPE = void 0;

var _execute_report = require("./execute_report");

var _monitor_reports = require("./monitor_reports");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const REPORTING_EXECUTE_TYPE = 'report:execute';
exports.REPORTING_EXECUTE_TYPE = REPORTING_EXECUTE_TYPE;
const REPORTING_MONITOR_TYPE = 'reports:monitor';
exports.REPORTING_MONITOR_TYPE = REPORTING_MONITOR_TYPE;
let ReportingTaskStatus;
exports.ReportingTaskStatus = ReportingTaskStatus;

(function (ReportingTaskStatus) {
  ReportingTaskStatus["UNINITIALIZED"] = "uninitialized";
  ReportingTaskStatus["INITIALIZED"] = "initialized";
})(ReportingTaskStatus || (exports.ReportingTaskStatus = ReportingTaskStatus = {}));