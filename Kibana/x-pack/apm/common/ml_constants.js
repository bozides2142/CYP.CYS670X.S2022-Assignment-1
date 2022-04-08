"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ANOMALY_THRESHOLD = exports.ANOMALY_SEVERITY = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// copied from ml/common, to keep the bundle size small

let ANOMALY_SEVERITY;
exports.ANOMALY_SEVERITY = ANOMALY_SEVERITY;

(function (ANOMALY_SEVERITY) {
  ANOMALY_SEVERITY["CRITICAL"] = "critical";
  ANOMALY_SEVERITY["MAJOR"] = "major";
  ANOMALY_SEVERITY["MINOR"] = "minor";
  ANOMALY_SEVERITY["WARNING"] = "warning";
  ANOMALY_SEVERITY["LOW"] = "low";
  ANOMALY_SEVERITY["UNKNOWN"] = "unknown";
})(ANOMALY_SEVERITY || (exports.ANOMALY_SEVERITY = ANOMALY_SEVERITY = {}));

let ANOMALY_THRESHOLD;
exports.ANOMALY_THRESHOLD = ANOMALY_THRESHOLD;

(function (ANOMALY_THRESHOLD) {
  ANOMALY_THRESHOLD[ANOMALY_THRESHOLD["CRITICAL"] = 75] = "CRITICAL";
  ANOMALY_THRESHOLD[ANOMALY_THRESHOLD["MAJOR"] = 50] = "MAJOR";
  ANOMALY_THRESHOLD[ANOMALY_THRESHOLD["MINOR"] = 25] = "MINOR";
  ANOMALY_THRESHOLD[ANOMALY_THRESHOLD["WARNING"] = 3] = "WARNING";
  ANOMALY_THRESHOLD[ANOMALY_THRESHOLD["LOW"] = 0] = "LOW";
})(ANOMALY_THRESHOLD || (exports.ANOMALY_THRESHOLD = ANOMALY_THRESHOLD = {}));