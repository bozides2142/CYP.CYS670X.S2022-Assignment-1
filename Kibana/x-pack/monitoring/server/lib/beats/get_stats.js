"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStats = getStats;
exports.handleResponse = handleResponse;

var _moment = _interopRequireDefault(require("moment"));

var _error_missing_required = require("../error_missing_required");

var _create_beats_query = require("./create_beats_query");

var _beats_stats = require("./_beats_stats");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function handleResponse(response) {
  const {
    beatTotal,
    beatTypes,
    totalEvents,
    bytesSent
  } = (0, _beats_stats.beatsAggResponseHandler)(response);
  return {
    total: beatTotal,
    types: beatTypes,
    stats: {
      totalEvents,
      bytesSent
    }
  };
}

async function getStats(req, beatsIndexPattern, clusterUuid) {
  (0, _error_missing_required.checkParam)(beatsIndexPattern, 'beatsIndexPattern in getBeats');
  const config = req.server.config;

  const start = _moment.default.utc(req.payload.timeRange.min).valueOf();

  const end = _moment.default.utc(req.payload.timeRange.max).valueOf();

  const maxBucketSize = config.ui.max_bucket_size;
  const params = {
    index: beatsIndexPattern,
    filter_path: _beats_stats.beatsAggFilterPath,
    size: 0,
    ignore_unavailable: true,
    body: {
      query: (0, _create_beats_query.createBeatsQuery)({
        start,
        end,
        clusterUuid
      }),
      aggs: (0, _beats_stats.beatsUuidsAgg)(maxBucketSize)
    }
  };
  const {
    callWithRequest
  } = req.server.plugins.elasticsearch.getCluster('monitoring');
  const response = await callWithRequest(req, 'search', params);
  return handleResponse(response);
}