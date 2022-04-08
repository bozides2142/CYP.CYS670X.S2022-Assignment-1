"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateToV3 = updateToV3;

var _lodash = require("lodash");

var _pLimit = _interopRequireDefault(require("p-limit"));

var _common = require("../../../../../ml/common");

var _create_anomaly_detection_jobs = require("../../../lib/anomaly_detection/create_anomaly_detection_jobs");

var _get_anomaly_detection_jobs = require("../../../lib/anomaly_detection/get_anomaly_detection_jobs");

var _with_apm_span = require("../../../utils/with_apm_span");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function updateToV3({
  logger,
  setup,
  esClient
}) {
  const allJobs = await (0, _get_anomaly_detection_jobs.getAnomalyDetectionJobs)(setup);
  const v2Jobs = allJobs.filter(job => job.version === 2);
  const activeV2Jobs = v2Jobs.filter(job => job.jobState === _common.JOB_STATE.OPENED || job.jobState === _common.JOB_STATE.OPENING);
  const environments = (0, _lodash.uniq)(v2Jobs.map(job => job.environment));
  const limiter = (0, _pLimit.default)(3);

  if (!v2Jobs.length) {
    return true;
  }

  if (activeV2Jobs.length) {
    await (0, _with_apm_span.withApmSpan)('anomaly_detection_stop_v2_jobs', () => Promise.all(activeV2Jobs.map(job => limiter(() => {
      return esClient.ml.closeJob({
        job_id: job.jobId
      });
    }))));
  }

  await (0, _create_anomaly_detection_jobs.createAnomalyDetectionJobs)(setup, environments, logger);
  return true;
}