"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMlJobsWithAPMGroup = getMlJobsWithAPMGroup;

var _with_apm_span = require("../../utils/with_apm_span");

var _constants = require("./constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// returns ml jobs containing "apm" group
// workaround: the ML api returns 404 when no jobs are found. This is handled so instead of throwing an empty response is returned


function catch404(e) {
  if (e.statusCode === 404) {
    return [];
  }

  throw e;
}

function getMlJobsWithAPMGroup(anomalyDetectors) {
  return (0, _with_apm_span.withApmSpan)('get_ml_jobs_with_apm_group', async () => {
    try {
      const [jobs, allJobStats, allDatafeedStats] = await Promise.all([anomalyDetectors.jobs(_constants.APM_ML_JOB_GROUP).then(response => response.jobs), anomalyDetectors.jobStats(_constants.APM_ML_JOB_GROUP).then(response => response.jobs).catch(catch404), anomalyDetectors.datafeedStats(`datafeed-${_constants.APM_ML_JOB_GROUP}*`).then(response => response.datafeeds).catch(catch404)]);
      return jobs.map(job => {
        var _job$custom_settings, _job$custom_settings$, _job$custom_settings$2, _job$custom_settings2, _job$custom_settings3;

        const jobStats = allJobStats.find(stats => stats.job_id === job.job_id);
        const datafeedStats = allDatafeedStats.find(stats => {
          var _job$datafeed_config;

          return stats.datafeed_id === ((_job$datafeed_config = job.datafeed_config) === null || _job$datafeed_config === void 0 ? void 0 : _job$datafeed_config.datafeed_id);
        });
        return {
          environment: String((_job$custom_settings = job.custom_settings) === null || _job$custom_settings === void 0 ? void 0 : (_job$custom_settings$ = _job$custom_settings.job_tags) === null || _job$custom_settings$ === void 0 ? void 0 : _job$custom_settings$.environment),
          jobId: job.job_id,
          jobState: jobStats === null || jobStats === void 0 ? void 0 : jobStats.state,
          version: Number((_job$custom_settings$2 = (_job$custom_settings2 = job.custom_settings) === null || _job$custom_settings2 === void 0 ? void 0 : (_job$custom_settings3 = _job$custom_settings2.job_tags) === null || _job$custom_settings3 === void 0 ? void 0 : _job$custom_settings3.apm_ml_version) !== null && _job$custom_settings$2 !== void 0 ? _job$custom_settings$2 : 1),
          datafeedId: datafeedStats === null || datafeedStats === void 0 ? void 0 : datafeedStats.datafeed_id,
          datafeedState: datafeedStats === null || datafeedStats === void 0 ? void 0 : datafeedStats.state
        };
      });
    } catch (e) {
      return catch404(e);
    }
  });
}