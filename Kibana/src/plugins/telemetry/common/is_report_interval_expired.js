"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isReportIntervalExpired = isReportIntervalExpired;

var _constants = require("./constants");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * The report is considered expired if:
 * - `lastReportAt` does not exist, is NaN or `REPORT_INTERVAL_MS` have passed ever since.
 * @param lastReportAt
 * @returns `true` if the report interval is considered expired
 */
function isReportIntervalExpired(lastReportAt) {
  return !lastReportAt || isNaN(lastReportAt) || Date.now() - lastReportAt > _constants.REPORT_INTERVAL_MS;
}