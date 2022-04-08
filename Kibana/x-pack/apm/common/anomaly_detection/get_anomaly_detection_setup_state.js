"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AnomalyDetectionSetupState = void 0;
exports.getAnomalyDetectionSetupState = getAnomalyDetectionSetupState;

var _use_fetcher = require("../../public/hooks/use_fetcher");

var _environment_filter_values = require("../environment_filter_values");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// eslint-disable-next-line @kbn/eslint/no-restricted-paths


let AnomalyDetectionSetupState;
exports.AnomalyDetectionSetupState = AnomalyDetectionSetupState;

(function (AnomalyDetectionSetupState) {
  AnomalyDetectionSetupState["Loading"] = "pending";
  AnomalyDetectionSetupState["Failure"] = "failure";
  AnomalyDetectionSetupState["Unknown"] = "unknown";
  AnomalyDetectionSetupState["NoJobs"] = "noJobs";
  AnomalyDetectionSetupState["NoJobsForEnvironment"] = "noJobsForEnvironment";
  AnomalyDetectionSetupState["LegacyJobs"] = "legacyJobs";
  AnomalyDetectionSetupState["UpgradeableJobs"] = "upgradeableJobs";
  AnomalyDetectionSetupState["UpToDate"] = "upToDate";
})(AnomalyDetectionSetupState || (exports.AnomalyDetectionSetupState = AnomalyDetectionSetupState = {}));

function getAnomalyDetectionSetupState({
  environment,
  jobs,
  fetchStatus,
  isAuthorized
}) {
  if (!isAuthorized) {
    return AnomalyDetectionSetupState.Unknown;
  }

  if (fetchStatus === _use_fetcher.FETCH_STATUS.LOADING) {
    return AnomalyDetectionSetupState.Loading;
  }

  if (fetchStatus === _use_fetcher.FETCH_STATUS.FAILURE) {
    return AnomalyDetectionSetupState.Failure;
  }

  if (fetchStatus !== _use_fetcher.FETCH_STATUS.SUCCESS) {
    return AnomalyDetectionSetupState.Unknown;
  }

  const jobsForEnvironment = environment === _environment_filter_values.ENVIRONMENT_ALL.value ? jobs : jobs.filter(job => job.environment === environment);
  const hasV1Jobs = jobs.some(job => job.version === 1);
  const hasV2Jobs = jobsForEnvironment.some(job => job.version === 2);
  const hasV3Jobs = jobsForEnvironment.some(job => job.version === 3);
  const hasAnyJobs = jobs.length > 0;

  if (hasV3Jobs) {
    return AnomalyDetectionSetupState.UpToDate;
  }

  if (hasV2Jobs) {
    return AnomalyDetectionSetupState.UpgradeableJobs;
  }

  if (hasV1Jobs) {
    return AnomalyDetectionSetupState.LegacyJobs;
  }

  if (hasAnyJobs) {
    return AnomalyDetectionSetupState.NoJobsForEnvironment;
  }

  return AnomalyDetectionSetupState.NoJobs;
}