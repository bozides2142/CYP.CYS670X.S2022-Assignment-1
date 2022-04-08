"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDefaultSearchParams = getDefaultSearchParams;
exports.getShardTimeout = getShardTimeout;

var _common = require("../../../../common");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function getShardTimeout(config) {
  const timeout = config.elasticsearch.shardTimeout.asMilliseconds();
  return timeout ? {
    timeout: `${timeout}ms`
  } : {};
}

async function getDefaultSearchParams(uiSettingsClient) {
  const maxConcurrentShardRequests = await uiSettingsClient.get(_common.UI_SETTINGS.COURIER_MAX_CONCURRENT_SHARD_REQUESTS);
  return {
    max_concurrent_shard_requests: maxConcurrentShardRequests > 0 ? maxConcurrentShardRequests : undefined,
    ignore_unavailable: true,
    // Don't fail if the index/indices don't exist
    track_total_hits: true
  };
}