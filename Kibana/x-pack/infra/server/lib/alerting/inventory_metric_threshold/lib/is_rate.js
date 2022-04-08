"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isRate = exports.isMetricRate = exports.isInterfaceRateAgg = exports.isCustomMetricRate = void 0;

var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const isMetricRate = metric => {
  const values = Object.values(metric);
  return values.some(agg => (0, _lodash.has)(agg, 'derivative')) && values.some(agg => (0, _lodash.has)(agg, 'max'));
};

exports.isMetricRate = isMetricRate;

const isCustomMetricRate = customMetric => {
  return customMetric.aggregation === 'rate';
};

exports.isCustomMetricRate = isCustomMetricRate;

const isInterfaceRateAgg = metric => {
  const values = Object.values(metric);
  return values.some(agg => (0, _lodash.has)(agg, 'terms')) && values.some(agg => (0, _lodash.has)(agg, 'sum_bucket'));
};

exports.isInterfaceRateAgg = isInterfaceRateAgg;

const isRate = (metric, customMetric) => {
  return isMetricRate(metric) || isInterfaceRateAgg(metric) || customMetric && isCustomMetricRate(customMetric);
};

exports.isRate = isRate;