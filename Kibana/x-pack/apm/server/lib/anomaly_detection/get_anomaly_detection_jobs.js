"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAnomalyDetectionJobs = getAnomalyDetectionJobs;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _anomaly_detection = require("../../../common/anomaly_detection");

var _get_ml_jobs_with_apm_group = require("./get_ml_jobs_with_apm_group");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getAnomalyDetectionJobs(setup) {
  const {
    ml
  } = setup;

  if (!ml) {
    throw _boom.default.notImplemented(_anomaly_detection.ML_ERRORS.ML_NOT_AVAILABLE);
  }

  return (0, _get_ml_jobs_with_apm_group.getMlJobsWithAPMGroup)(ml.anomalyDetectors);
}