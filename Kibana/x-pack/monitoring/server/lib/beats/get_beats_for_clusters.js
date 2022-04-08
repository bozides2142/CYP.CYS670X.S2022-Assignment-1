"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBeatsForClusters = getBeatsForClusters;
exports.handleResponse = handleResponse;

var _metrics = require("../metrics");

var _create_beats_query = require("./create_beats_query");

var _beats_stats = require("./_beats_stats");

var _get_index_patterns = require("../cluster/get_index_patterns");

var _static_globals = require("../../static_globals");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function handleResponse(clusterUuid, response) {
  const {
    beatTotal,
    beatTypes,
    totalEvents,
    bytesSent
  } = (0, _beats_stats.beatsAggResponseHandler)(response); // combine stats

  const stats = {
    totalEvents,
    bytesSent,
    beats: {
      total: beatTotal,
      types: beatTypes
    }
  };
  return {
    clusterUuid,
    stats
  };
}

function getBeatsForClusters(req, clusters, ccs) {
  const start = req.payload.timeRange.min;
  const end = req.payload.timeRange.max;
  const config = req.server.config;
  const maxBucketSize = config.ui.max_bucket_size;
  const indexPatterns = (0, _get_index_patterns.getLegacyIndexPattern)({
    moduleType: 'beats',
    ccs,
    config: _static_globals.Globals.app.config
  });
  return Promise.all(clusters.map(async cluster => {
    var _cluster$elasticsearc, _cluster$elasticsearc2, _cluster$elasticsearc3;

    const clusterUuid = (_cluster$elasticsearc = (_cluster$elasticsearc2 = cluster.elasticsearch) === null || _cluster$elasticsearc2 === void 0 ? void 0 : (_cluster$elasticsearc3 = _cluster$elasticsearc2.cluster) === null || _cluster$elasticsearc3 === void 0 ? void 0 : _cluster$elasticsearc3.id) !== null && _cluster$elasticsearc !== void 0 ? _cluster$elasticsearc : cluster.cluster_uuid;
    const params = {
      index: indexPatterns,
      size: 0,
      ignore_unavailable: true,
      filter_path: _beats_stats.beatsAggFilterPath,
      body: {
        query: (0, _create_beats_query.createBeatsQuery)({
          start,
          end,
          clusterUuid,
          metric: _metrics.BeatsClusterMetric.getMetricFields() // override default of BeatMetric.getMetricFields

        }),
        aggs: (0, _beats_stats.beatsUuidsAgg)(maxBucketSize)
      }
    };
    const {
      callWithRequest
    } = req.server.plugins.elasticsearch.getCluster('monitoring');
    const response = await callWithRequest(req, 'search', params);
    return handleResponse(clusterUuid, response);
  }));
}