"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SEVERITY_COLOR_RAMP = exports.SEVERITY_COLORS = exports.PARTITION_FIELD_VALUE = exports.PARTITION_FIELDS = exports.JOB_ID = exports.ANOMALY_THRESHOLD = exports.ANOMALY_SEVERITY = exports.ANOMALY_RESULT_TYPE = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Labels displayed in the ML UI to indicate the severity of the anomaly according
 * to the normalized anomaly score.
 */

let ANOMALY_SEVERITY;
/**
 * Anomaly score numeric thresholds to indicate the severity of the anomaly.
 */

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
/**
 * RGB hex codes used to indicate the severity of an anomaly according to its anomaly score.
 */

exports.ANOMALY_THRESHOLD = ANOMALY_THRESHOLD;

(function (ANOMALY_THRESHOLD) {
  ANOMALY_THRESHOLD[ANOMALY_THRESHOLD["CRITICAL"] = 75] = "CRITICAL";
  ANOMALY_THRESHOLD[ANOMALY_THRESHOLD["MAJOR"] = 50] = "MAJOR";
  ANOMALY_THRESHOLD[ANOMALY_THRESHOLD["MINOR"] = 25] = "MINOR";
  ANOMALY_THRESHOLD[ANOMALY_THRESHOLD["WARNING"] = 3] = "WARNING";
  ANOMALY_THRESHOLD[ANOMALY_THRESHOLD["LOW"] = 0] = "LOW";
})(ANOMALY_THRESHOLD || (exports.ANOMALY_THRESHOLD = ANOMALY_THRESHOLD = {}));

const SEVERITY_COLORS = {
  /**
   * Color used in the UI to indicate a critical anomaly, with a score greater than or equal to 75.
   */
  CRITICAL: '#fe5050',

  /**
   * Color used in the UI to indicate a major anomaly, with a score greater than or equal to 50 and less than 75 .
   */
  MAJOR: '#fba740',

  /**
   * Color used in the UI to indicate a minor anomaly, with a score greater than or equal to 25 and less than 50.
   */
  MINOR: '#fdec25',

  /**
   * Color used in the UI to indicate a warning anomaly, with a score greater than or equal to 3 and less than 25.
   * Note in some parts of the UI, warning severity is used when the score is greater than or equal to 0.
   */
  WARNING: '#8bc8fb',

  /**
   * Color used in some parts of the UI to indicate a low severity anomaly, with a score greater than or equal to 0 and less than 3.
   */
  LOW: '#d2e9f7',

  /**
   * Color used in the UI to indicate an anomaly for which the score is unknown.
   */
  BLANK: '#ffffff'
};
exports.SEVERITY_COLORS = SEVERITY_COLORS;
const SEVERITY_COLOR_RAMP = [{
  stop: ANOMALY_THRESHOLD.LOW,
  color: SEVERITY_COLORS.WARNING
}, {
  stop: ANOMALY_THRESHOLD.MINOR,
  color: SEVERITY_COLORS.MINOR
}, {
  stop: ANOMALY_THRESHOLD.MAJOR,
  color: SEVERITY_COLORS.MAJOR
}, {
  stop: ANOMALY_THRESHOLD.CRITICAL,
  color: SEVERITY_COLORS.CRITICAL
}];
exports.SEVERITY_COLOR_RAMP = SEVERITY_COLOR_RAMP;
const ANOMALY_RESULT_TYPE = {
  BUCKET: 'bucket',
  RECORD: 'record',
  INFLUENCER: 'influencer'
};
exports.ANOMALY_RESULT_TYPE = ANOMALY_RESULT_TYPE;
const PARTITION_FIELDS = ['partition_field', 'over_field', 'by_field'];
exports.PARTITION_FIELDS = PARTITION_FIELDS;
const JOB_ID = 'job_id';
exports.JOB_ID = JOB_ID;
const PARTITION_FIELD_VALUE = 'partition_field_value';
exports.PARTITION_FIELD_VALUE = PARTITION_FIELD_VALUE;