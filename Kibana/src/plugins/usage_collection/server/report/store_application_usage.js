"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.storeApplicationUsage = void 0;

var _moment = _interopRequireDefault(require("moment"));

var _application_usage = require("../../common/application_usage");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const storeApplicationUsage = async (repository, appUsages, timestamp) => {
  if (!appUsages.length) {
    return;
  }

  const dayId = getDayId(timestamp);
  const aggregatedReports = aggregateAppUsages(appUsages);
  return Promise.allSettled(aggregatedReports.map(async report => incrementUsageCounters(repository, report, dayId)));
};

exports.storeApplicationUsage = storeApplicationUsage;

const aggregateAppUsages = appUsages => {
  return [...appUsages.reduce((map, appUsage) => {
    var _map$get;

    const key = getKey(appUsage);
    const aggregated = (_map$get = map.get(key)) !== null && _map$get !== void 0 ? _map$get : {
      appId: appUsage.appId,
      viewId: appUsage.viewId,
      minutesOnScreen: 0,
      numberOfClicks: 0
    };
    aggregated.minutesOnScreen += appUsage.minutesOnScreen;
    aggregated.numberOfClicks += appUsage.numberOfClicks;
    map.set(key, aggregated);
    return map;
  }, new Map()).values()];
};

const incrementUsageCounters = (repository, {
  appId,
  viewId,
  numberOfClicks,
  minutesOnScreen
}, dayId) => {
  const dailyId = (0, _application_usage.getDailyId)({
    appId,
    viewId,
    dayId
  });
  return repository.incrementCounter('application_usage_daily', dailyId, [{
    fieldName: 'numberOfClicks',
    incrementBy: numberOfClicks
  }, {
    fieldName: 'minutesOnScreen',
    incrementBy: minutesOnScreen
  }], {
    upsertAttributes: {
      appId,
      viewId,
      timestamp: getTimestamp(dayId)
    }
  });
};

const getKey = ({
  viewId,
  appId
}) => `${appId}___${viewId}`;

const getDayId = timestamp => (0, _moment.default)(timestamp).format('YYYY-MM-DD');

const getTimestamp = dayId => {
  // Concatenating the day in YYYY-MM-DD form to T00:00:00Z to reduce the TZ effects
  return (0, _moment.default)(`${(0, _moment.default)(dayId).format('YYYY-MM-DD')}T00:00:00Z`).toISOString();
};