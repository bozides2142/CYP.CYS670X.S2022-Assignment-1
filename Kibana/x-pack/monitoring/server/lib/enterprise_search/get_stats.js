"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStats = getStats;

var _moment = _interopRequireDefault(require("moment"));

var _create_enterprise_search_query = require("./create_enterprise_search_query");

var _enterprise_search_stats = require("./_enterprise_search_stats");

var _get_index_patterns = require("../cluster/get_index_patterns");

var _static_globals = require("../../static_globals");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getStats(req, clusterUuid) {
  const config = req.server.config;

  const start = _moment.default.utc(req.payload.timeRange.min).valueOf();

  const end = _moment.default.utc(req.payload.timeRange.max).valueOf();

  const maxBucketSize = config.ui.max_bucket_size; // just get the legacy pattern since no integration exists yet

  const indexPattern = (0, _get_index_patterns.getLegacyIndexPattern)({
    moduleType: 'enterprisesearch',
    config: _static_globals.Globals.app.config,
    ccs: req.payload.ccs
  });
  const params = {
    index: indexPattern,
    filter_path: _enterprise_search_stats.entSearchAggFilterPath,
    size: 0,
    ignore_unavailable: true,
    body: {
      query: (0, _create_enterprise_search_query.createEnterpriseSearchQuery)({
        start,
        end,
        uuid: clusterUuid
      }),
      aggs: (0, _enterprise_search_stats.entSearchUuidsAgg)(maxBucketSize)
    }
  };
  const {
    callWithRequest
  } = req.server.plugins.elasticsearch.getCluster('monitoring');
  const response = await callWithRequest(req, 'search', params);
  return (0, _enterprise_search_stats.entSearchAggResponseHandler)(response);
}