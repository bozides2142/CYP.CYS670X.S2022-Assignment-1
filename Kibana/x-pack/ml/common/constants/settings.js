"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEFAULT_ENABLE_AD_RESULTS_TIME_FILTER = exports.DEFAULT_AD_RESULTS_TIME_FILTER = exports.ANOMALY_DETECTION_ENABLE_TIME_RANGE = exports.ANOMALY_DETECTION_DEFAULT_TIME_RANGE = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const ANOMALY_DETECTION_ENABLE_TIME_RANGE = 'ml:anomalyDetection:results:enableTimeDefaults';
exports.ANOMALY_DETECTION_ENABLE_TIME_RANGE = ANOMALY_DETECTION_ENABLE_TIME_RANGE;
const ANOMALY_DETECTION_DEFAULT_TIME_RANGE = 'ml:anomalyDetection:results:timeDefaults';
exports.ANOMALY_DETECTION_DEFAULT_TIME_RANGE = ANOMALY_DETECTION_DEFAULT_TIME_RANGE;
const DEFAULT_AD_RESULTS_TIME_FILTER = {
  from: 'now-15m',
  to: 'now'
};
exports.DEFAULT_AD_RESULTS_TIME_FILTER = DEFAULT_AD_RESULTS_TIME_FILTER;
const DEFAULT_ENABLE_AD_RESULTS_TIME_FILTER = false;
exports.DEFAULT_ENABLE_AD_RESULTS_TIME_FILTER = DEFAULT_ENABLE_AD_RESULTS_TIME_FILTER;