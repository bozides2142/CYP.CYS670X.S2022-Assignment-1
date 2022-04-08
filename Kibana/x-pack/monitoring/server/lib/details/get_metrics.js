"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMetrics = getMetrics;

var _moment = _interopRequireDefault(require("moment"));

var _error_missing_required = require("../error_missing_required");

var _get_series = require("./get_series");

var _calculate_timeseries_interval = require("../calculate_timeseries_interval");

var _get_timezone = require("../get_timezone");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// TODO: Switch to an options object argument here


async function getMetrics(req, moduleType, metricSet = [], filters = [], metricOptions = {}, numOfBuckets = 0, groupBy = null) {
  (0, _error_missing_required.checkParam)(moduleType, 'moduleType in details/getMetrics');
  (0, _error_missing_required.checkParam)(metricSet, 'metricSet in details/getMetrics');
  const config = req.server.config; // TODO: Pass in req parameters as explicit function parameters

  let min = _moment.default.utc(req.payload.timeRange.min).valueOf();

  const max = _moment.default.utc(req.payload.timeRange.max).valueOf();

  const minIntervalSeconds = config.ui.min_interval_seconds;
  const bucketSize = (0, _calculate_timeseries_interval.calculateTimeseriesInterval)(min, max, minIntervalSeconds);
  const timezone = await (0, _get_timezone.getTimezone)(req); // If specified, adjust the time period to ensure we only return this many buckets

  if (numOfBuckets > 0) {
    min = max - numOfBuckets * bucketSize * 1000;
  }

  return Promise.all(metricSet.map(metric => {
    // metric names match the literal metric name, but they can be supplied in groups or individually
    let metricNames;

    if (typeof metric !== 'string') {
      metricNames = typeof metric.keys === 'string' ? [metric.keys] : metric.keys;
    } else {
      metricNames = [metric];
    }

    return Promise.all(metricNames.map(metricName => {
      return (0, _get_series.getSeries)(req, moduleType, metricName, metricOptions, filters, groupBy, {
        min,
        max,
        bucketSize,
        timezone
      });
    }));
  })).then(rows => {
    const data = {};
    metricSet.forEach((key, index) => {
      // keyName must match the value stored in the html template
      const keyName = typeof key === 'string' ? key : key.name;
      data[keyName] = rows[index];
    });
    return data;
  });
}