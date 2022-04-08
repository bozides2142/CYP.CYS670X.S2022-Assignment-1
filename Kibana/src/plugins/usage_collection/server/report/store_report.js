"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.storeReport = storeReport;

var _moment = _interopRequireDefault(require("moment"));

var _lodash = require("lodash");

var _store_application_usage = require("./store_application_usage");

var _ui_counters = require("../../common/ui_counters");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
async function storeReport(internalRepository, uiCountersUsageCounter, report) {
  const uiCounters = report.uiCounter ? Object.entries(report.uiCounter) : [];
  const userAgents = report.userAgent ? Object.entries(report.userAgent) : [];
  const appUsages = report.application_usage ? Object.values(report.application_usage) : [];
  const momentTimestamp = (0, _moment.default)();
  const timestamp = momentTimestamp.toDate();
  return Promise.allSettled([// User Agent
  ...userAgents.map(async ([key, metric]) => {
    const {
      userAgent
    } = metric;
    const savedObjectId = `${key}:${userAgent}`;
    return await internalRepository.create('ui-metric', {
      count: 1
    }, {
      id: savedObjectId,
      overwrite: true
    });
  }), // Deprecated UI metrics, Use data from UI Counters.
  ...(0, _lodash.chain)(report.uiCounter).groupBy(e => `${e.appName}:${e.eventName}`).entries().map(([savedObjectId, metric]) => {
    return {
      savedObjectId,
      incrementBy: (0, _lodash.sumBy)(metric, 'total')
    };
  }).map(async ({
    savedObjectId,
    incrementBy
  }) => {
    return await internalRepository.incrementCounter('ui-metric', savedObjectId, [{
      fieldName: 'count',
      incrementBy
    }]);
  }).value(), // UI Counters
  ...uiCounters.map(async ([, metric]) => {
    const {
      appName,
      eventName,
      total,
      type
    } = metric;
    const counterName = (0, _ui_counters.serializeUiCounterName)({
      appName,
      eventName
    });
    uiCountersUsageCounter.incrementCounter({
      counterName,
      counterType: type,
      incrementBy: total
    });
  }), // Application Usage
  (0, _store_application_usage.storeApplicationUsage)(internalRepository, appUsages, timestamp)]);
}