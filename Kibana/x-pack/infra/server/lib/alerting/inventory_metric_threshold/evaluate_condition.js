"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.evaluateCondition = void 0;

var _lodash = require("lodash");

var _moment = _interopRequireDefault(require("moment"));

var _metrics = require("../../../../common/alerting/metrics");

var _calculate_from_based_on_metric = require("./lib/calculate_from_based_on_metric");

var _get_data = require("./lib/get_data");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const evaluateCondition = async ({
  condition,
  nodeType,
  source,
  logQueryFields,
  esClient,
  compositeSize,
  filterQuery,
  lookbackSize,
  startTime
}) => {
  var _warningThreshold;

  const {
    comparator,
    warningComparator,
    metric,
    customMetric
  } = condition;
  let {
    threshold,
    warningThreshold
  } = condition;
  const to = startTime ? (0, _moment.default)(startTime) : (0, _moment.default)();
  const timerange = {
    to: to.valueOf(),
    from: (0, _calculate_from_based_on_metric.calcualteFromBasedOnMetric)(to, condition, nodeType, metric, customMetric),
    interval: `${condition.timeSize}${condition.timeUnit}`,
    forceInterval: true
  };

  if (lookbackSize) {
    timerange.lookbackSize = lookbackSize;
  }

  const currentValues = await (0, _get_data.getData)(esClient, nodeType, metric, timerange, source, logQueryFields, compositeSize, filterQuery, customMetric);
  threshold = threshold.map(n => convertMetricValue(metric, n));
  warningThreshold = (_warningThreshold = warningThreshold) === null || _warningThreshold === void 0 ? void 0 : _warningThreshold.map(n => convertMetricValue(metric, n));

  const valueEvaluator = (value, t, c) => {
    if (value === undefined || value === null || !t || !c) return [false];
    const comparisonFunction = comparatorMap[c];
    return [comparisonFunction(value, t)];
  };

  const result = (0, _lodash.mapValues)(currentValues, value => {
    return { ...condition,
      shouldFire: valueEvaluator(value, threshold, comparator),
      shouldWarn: valueEvaluator(value, warningThreshold, warningComparator),
      isNoData: [value === null],
      isError: value === undefined,
      currentValue: getCurrentValue(value)
    };
  }); // Typescript doesn't seem to know what `throw` is doing

  return result;
};

exports.evaluateCondition = evaluateCondition;

const getCurrentValue = value => {
  if (value !== null) return Number(value);
  return NaN;
};

const comparatorMap = {
  [_metrics.Comparator.BETWEEN]: (value, [a, b]) => value >= Math.min(a, b) && value <= Math.max(a, b),
  // `threshold` is always an array of numbers in case the BETWEEN comparator is
  // used; all other compartors will just destructure the first value in the array
  [_metrics.Comparator.GT]: (a, [b]) => a > b,
  [_metrics.Comparator.LT]: (a, [b]) => a < b,
  [_metrics.Comparator.OUTSIDE_RANGE]: (value, [a, b]) => value < a || value > b,
  [_metrics.Comparator.GT_OR_EQ]: (a, [b]) => a >= b,
  [_metrics.Comparator.LT_OR_EQ]: (a, [b]) => a <= b
}; // Some metrics in the UI are in a different unit that what we store in ES.

const convertMetricValue = (metric, value) => {
  if (converters[metric]) {
    return converters[metric](value);
  } else {
    return value;
  }
};

const converters = {
  cpu: n => Number(n) / 100,
  memory: n => Number(n) / 100
};