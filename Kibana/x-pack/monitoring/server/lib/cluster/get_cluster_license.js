"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getClusterLicense = getClusterLicense;

var _create_query = require("../create_query");

var _metrics = require("../metrics");

var _get_index_patterns = require("./get_index_patterns");

var _static_globals = require("../../static_globals");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @ts-ignore
// @ts-ignore
// @ts-ignore
// is this being used anywhere?  not called within the app


function getClusterLicense(req, clusterUuid) {
  const dataset = 'cluster_stats';
  const moduleType = 'elasticsearch';
  const indexPattern = (0, _get_index_patterns.getNewIndexPatterns)({
    config: _static_globals.Globals.app.config,
    moduleType,
    dataset,
    ccs: req.payload.ccs
  });
  const params = {
    index: indexPattern,
    size: 1,
    ignore_unavailable: true,
    filter_path: ['hits.hits._source.license'],
    body: {
      sort: {
        timestamp: {
          order: 'desc',
          unmapped_type: 'long'
        }
      },
      query: (0, _create_query.createQuery)({
        type: dataset,
        dsDataset: `${moduleType}.${dataset}`,
        metricset: dataset,
        clusterUuid,
        metric: _metrics.ElasticsearchMetric.getMetricFields()
      })
    }
  };
  const {
    callWithRequest
  } = req.server.plugins.elasticsearch.getCluster('monitoring');
  return callWithRequest(req, 'search', params).then(response => {
    var _response$hits, _response$hits$hits$;

    return (_response$hits = response.hits) === null || _response$hits === void 0 ? void 0 : (_response$hits$hits$ = _response$hits.hits[0]) === null || _response$hits$hits$ === void 0 ? void 0 : _response$hits$hits$._source.license;
  });
}