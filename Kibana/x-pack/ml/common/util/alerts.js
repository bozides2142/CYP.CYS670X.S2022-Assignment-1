"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLookbackInterval = getLookbackInterval;
exports.getResultJobsHealthRuleConfig = getResultJobsHealthRuleConfig;
exports.getTopNBuckets = getTopNBuckets;
exports.resolveLookbackInterval = resolveLookbackInterval;

var _lodash = require("lodash");

var _job_utils = require("./job_utils");

var _guards = require("../types/guards");

var _parse_interval = require("./parse_interval");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const narrowBucketLength = 60;
/**
 * Resolves the lookback interval for the rule
 * using the formula max(2m, 2 * bucket_span) + query_delay + 1s.
 * and rounds up to a whole number of minutes.
 */

function resolveLookbackInterval(jobs, datafeeds) {
  var _resolveMaxTimeInterv, _resolveMaxTimeInterv2;

  const bucketSpanInSeconds = Math.ceil((_resolveMaxTimeInterv = (0, _job_utils.resolveMaxTimeInterval)(jobs.map(v => v.analysis_config.bucket_span))) !== null && _resolveMaxTimeInterv !== void 0 ? _resolveMaxTimeInterv : 0);
  const queryDelayInSeconds = Math.ceil((_resolveMaxTimeInterv2 = (0, _job_utils.resolveMaxTimeInterval)(datafeeds.map(v => v.query_delay).filter(_guards.isDefined))) !== null && _resolveMaxTimeInterv2 !== void 0 ? _resolveMaxTimeInterv2 : 0);
  const result = Math.max(2 * narrowBucketLength, 2 * bucketSpanInSeconds) + queryDelayInSeconds + 1;
  return `${Math.ceil(result / 60)}m`;
}
/**
 * @deprecated We should avoid using {@link CombinedJobWithStats}. Replace usages with {@link resolveLookbackInterval} when
 * Kibana API returns mapped job and the datafeed configs.
 */


function getLookbackInterval(jobs) {
  return resolveLookbackInterval(jobs, jobs.map(v => v.datafeed_config));
}

function getTopNBuckets(job) {
  const bucketSpan = (0, _parse_interval.parseInterval)(job.analysis_config.bucket_span);

  if (bucketSpan === null) {
    throw new Error('Unable to resolve a bucket span length');
  }

  return Math.ceil(narrowBucketLength / bucketSpan.asSeconds());
}

const implementedTests = ['datafeed', 'mml', 'delayedData', 'errorMessages'];
/**
 * Returns tests configuration combined with default values.
 * @param config
 */

function getResultJobsHealthRuleConfig(config) {
  var _config$datafeed$enab, _config$datafeed, _config$mml$enabled, _config$mml, _config$delayedData$e, _config$delayedData, _config$delayedData$d, _config$delayedData2, _config$delayedData$t, _config$delayedData3, _config$behindRealtim, _config$behindRealtim2, _config$errorMessages, _config$errorMessages2;

  const result = {
    datafeed: {
      enabled: (_config$datafeed$enab = config === null || config === void 0 ? void 0 : (_config$datafeed = config.datafeed) === null || _config$datafeed === void 0 ? void 0 : _config$datafeed.enabled) !== null && _config$datafeed$enab !== void 0 ? _config$datafeed$enab : true
    },
    mml: {
      enabled: (_config$mml$enabled = config === null || config === void 0 ? void 0 : (_config$mml = config.mml) === null || _config$mml === void 0 ? void 0 : _config$mml.enabled) !== null && _config$mml$enabled !== void 0 ? _config$mml$enabled : true
    },
    delayedData: {
      enabled: (_config$delayedData$e = config === null || config === void 0 ? void 0 : (_config$delayedData = config.delayedData) === null || _config$delayedData === void 0 ? void 0 : _config$delayedData.enabled) !== null && _config$delayedData$e !== void 0 ? _config$delayedData$e : true,
      docsCount: (_config$delayedData$d = config === null || config === void 0 ? void 0 : (_config$delayedData2 = config.delayedData) === null || _config$delayedData2 === void 0 ? void 0 : _config$delayedData2.docsCount) !== null && _config$delayedData$d !== void 0 ? _config$delayedData$d : 1,
      timeInterval: (_config$delayedData$t = config === null || config === void 0 ? void 0 : (_config$delayedData3 = config.delayedData) === null || _config$delayedData3 === void 0 ? void 0 : _config$delayedData3.timeInterval) !== null && _config$delayedData$t !== void 0 ? _config$delayedData$t : null
    },
    behindRealtime: {
      enabled: (_config$behindRealtim = config === null || config === void 0 ? void 0 : (_config$behindRealtim2 = config.behindRealtime) === null || _config$behindRealtim2 === void 0 ? void 0 : _config$behindRealtim2.enabled) !== null && _config$behindRealtim !== void 0 ? _config$behindRealtim : true
    },
    errorMessages: {
      enabled: (_config$errorMessages = config === null || config === void 0 ? void 0 : (_config$errorMessages2 = config.errorMessages) === null || _config$errorMessages2 === void 0 ? void 0 : _config$errorMessages2.enabled) !== null && _config$errorMessages !== void 0 ? _config$errorMessages : true
    }
  };
  return (0, _lodash.pick)(result, implementedTests);
}