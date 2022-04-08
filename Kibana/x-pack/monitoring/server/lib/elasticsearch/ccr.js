"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkCcrEnabled = checkCcrEnabled;

var _moment = _interopRequireDefault(require("moment"));

var _metrics = require("../metrics");

var _create_query = require("../create_query");

var _get_index_patterns = require("../cluster/get_index_patterns");

var _static_globals = require("../../static_globals");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @ts-ignore
// @ts-ignore


async function checkCcrEnabled(req, ccs) {
  var _response$hits, _response$hits$hits$, _response$hits$hits$$, _response$hits$hits$$2, _response$hits2, _response$hits2$hits$, _response$hits2$hits$2, _response$hits2$hits$3, _response$hits2$hits$4, _response$hits2$hits$5, _response$hits2$hits$6, _response$hits2$hits$7, _legacyCcr$enabled, _legacyCcr$available;

  const dataset = 'cluster_stats';
  const moduleType = 'elasticsearch';
  const indexPatterns = (0, _get_index_patterns.getNewIndexPatterns)({
    config: _static_globals.Globals.app.config,
    moduleType,
    dataset,
    ccs
  });

  const start = _moment.default.utc(req.payload.timeRange.min).valueOf();

  const end = _moment.default.utc(req.payload.timeRange.max).valueOf();

  const clusterUuid = req.params.clusterUuid;

  const metricFields = _metrics.ElasticsearchMetric.getMetricFields();

  const params = {
    index: indexPatterns,
    size: 1,
    ignore_unavailable: true,
    body: {
      query: (0, _create_query.createQuery)({
        type: dataset,
        dsDataset: `${moduleType}.${dataset}`,
        metricset: dataset,
        start,
        end,
        clusterUuid,
        metric: metricFields
      }),
      sort: [{
        timestamp: {
          order: 'desc',
          unmapped_type: 'long'
        }
      }]
    },
    filter_path: ['hits.hits._source.stack_stats.xpack.ccr', 'hits.hits._source.elasticsearch.cluster.stats.stack.xpack.ccr']
  };
  const {
    callWithRequest
  } = req.server.plugins.elasticsearch.getCluster('monitoring');
  const response = await callWithRequest(req, 'search', params);
  const legacyCcr = (_response$hits = response.hits) === null || _response$hits === void 0 ? void 0 : (_response$hits$hits$ = _response$hits.hits[0]) === null || _response$hits$hits$ === void 0 ? void 0 : (_response$hits$hits$$ = _response$hits$hits$._source.stack_stats) === null || _response$hits$hits$$ === void 0 ? void 0 : (_response$hits$hits$$2 = _response$hits$hits$$.xpack) === null || _response$hits$hits$$2 === void 0 ? void 0 : _response$hits$hits$$2.ccr;
  const mbCcr = (_response$hits2 = response.hits) === null || _response$hits2 === void 0 ? void 0 : (_response$hits2$hits$ = _response$hits2.hits[0]) === null || _response$hits2$hits$ === void 0 ? void 0 : (_response$hits2$hits$2 = _response$hits2$hits$._source) === null || _response$hits2$hits$2 === void 0 ? void 0 : (_response$hits2$hits$3 = _response$hits2$hits$2.elasticsearch) === null || _response$hits2$hits$3 === void 0 ? void 0 : (_response$hits2$hits$4 = _response$hits2$hits$3.cluster) === null || _response$hits2$hits$4 === void 0 ? void 0 : (_response$hits2$hits$5 = _response$hits2$hits$4.stats) === null || _response$hits2$hits$5 === void 0 ? void 0 : (_response$hits2$hits$6 = _response$hits2$hits$5.stack) === null || _response$hits2$hits$6 === void 0 ? void 0 : (_response$hits2$hits$7 = _response$hits2$hits$6.xpack) === null || _response$hits2$hits$7 === void 0 ? void 0 : _response$hits2$hits$7.ccr;
  const isEnabled = (_legacyCcr$enabled = legacyCcr === null || legacyCcr === void 0 ? void 0 : legacyCcr.enabled) !== null && _legacyCcr$enabled !== void 0 ? _legacyCcr$enabled : mbCcr === null || mbCcr === void 0 ? void 0 : mbCcr.enabled;
  const isAvailable = (_legacyCcr$available = legacyCcr === null || legacyCcr === void 0 ? void 0 : legacyCcr.available) !== null && _legacyCcr$available !== void 0 ? _legacyCcr$available : mbCcr === null || mbCcr === void 0 ? void 0 : mbCcr.available;
  return Boolean(isEnabled && isAvailable);
}