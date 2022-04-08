"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTelemetrySavedQueriesTaskConfig = createTelemetrySavedQueriesTaskConfig;

var _constants = require("../constants");

var _helpers = require("../helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function createTelemetrySavedQueriesTaskConfig() {
  return {
    type: 'osquery:telemetry-saved-queries',
    title: 'Osquery Saved Queries Telemetry',
    interval: '24h',
    timeout: '10m',
    version: '1.0.0',
    runTask: async (taskId, logger, receiver, sender) => {
      const [clusterInfoPromise, licenseInfoPromise] = await Promise.allSettled([receiver.fetchClusterInfo(), receiver.fetchLicenseInfo()]);
      const clusterInfo = clusterInfoPromise.status === 'fulfilled' ? clusterInfoPromise.value : {};
      const licenseInfo = licenseInfoPromise.status === 'fulfilled' ? licenseInfoPromise.value : {};
      const savedQueriesResponse = await receiver.fetchSavedQueries();

      if (!(savedQueriesResponse !== null && savedQueriesResponse !== void 0 && savedQueriesResponse.total)) {
        logger.debug('no saved queries found');
        return 0;
      }

      const savedQueriesJson = (0, _helpers.templateSavedQueries)(savedQueriesResponse === null || savedQueriesResponse === void 0 ? void 0 : savedQueriesResponse.saved_objects, clusterInfo, licenseInfo);
      sender.sendOnDemand(_constants.TELEMETRY_CHANNEL_SAVED_QUERIES, savedQueriesJson);
      return savedQueriesResponse.total;
    }
  };
}