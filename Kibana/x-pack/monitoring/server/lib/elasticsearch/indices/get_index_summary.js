"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getIndexSummary = getIndexSummary;
exports.handleResponse = handleResponse;

var _lodash = require("lodash");

var _i18n = require("@kbn/i18n");

var _create_query = require("../../create_query");

var _metrics = require("../../metrics");

var _get_index_patterns = require("../../cluster/get_index_patterns");

var _static_globals = require("../../../static_globals");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @ts-ignore
// @ts-ignore


function handleResponse(shardStats, indexUuid) {
  return response => {
    var _response$hits$hits$, _response$hits, _response$hits$hits$2, _response$hits2, _response$hits2$hits$, _response$hits2$hits$2, _primaries$docs, _primaries$store, _total$store;

    const indexStats = (_response$hits$hits$ = (_response$hits = response.hits) === null || _response$hits === void 0 ? void 0 : (_response$hits$hits$2 = _response$hits.hits[0]) === null || _response$hits$hits$2 === void 0 ? void 0 : _response$hits$hits$2._source.index_stats) !== null && _response$hits$hits$ !== void 0 ? _response$hits$hits$ : (_response$hits2 = response.hits) === null || _response$hits2 === void 0 ? void 0 : (_response$hits2$hits$ = _response$hits2.hits[0]) === null || _response$hits2$hits$ === void 0 ? void 0 : (_response$hits2$hits$2 = _response$hits2$hits$._source.elasticsearch) === null || _response$hits2$hits$2 === void 0 ? void 0 : _response$hits2$hits$2.index;
    const primaries = indexStats === null || indexStats === void 0 ? void 0 : indexStats.primaries;
    const total = indexStats === null || indexStats === void 0 ? void 0 : indexStats.total;
    const stats = {
      documents: primaries === null || primaries === void 0 ? void 0 : (_primaries$docs = primaries.docs) === null || _primaries$docs === void 0 ? void 0 : _primaries$docs.count,
      dataSize: {
        primaries: primaries === null || primaries === void 0 ? void 0 : (_primaries$store = primaries.store) === null || _primaries$store === void 0 ? void 0 : _primaries$store.size_in_bytes,
        total: total === null || total === void 0 ? void 0 : (_total$store = total.store) === null || _total$store === void 0 ? void 0 : _total$store.size_in_bytes
      }
    };
    let indexSummary = {};

    const _shardStats = (0, _lodash.get)(shardStats, ['indices', indexUuid]);

    if (_shardStats) {
      const unassigned = _shardStats.unassigned;
      const unassignedShards = (0, _lodash.get)(unassigned, 'primary', 0) + (0, _lodash.get)(unassigned, 'replica', 0);
      indexSummary = {
        unassignedShards,
        totalShards: (0, _lodash.get)(_shardStats, 'primary', 0) + (0, _lodash.get)(_shardStats, 'replica', 0) + unassignedShards,
        status: _shardStats.status || _i18n.i18n.translate('xpack.monitoring.es.indices.unknownStatusLabel', {
          defaultMessage: 'Unknown'
        })
      };
    } else {
      indexSummary = {
        status: _i18n.i18n.translate('xpack.monitoring.es.indices.notAvailableStatusLabel', {
          defaultMessage: 'Not Available'
        })
      };
    }

    return { ...stats,
      ...indexSummary
    };
  };
}

function getIndexSummary(req, shardStats, {
  clusterUuid,
  indexUuid,
  start,
  end
}) {
  const dataset = 'index'; // data_stream.dataset

  const type = 'index_stats'; // legacy

  const moduleType = 'elasticsearch';
  const indexPatterns = (0, _get_index_patterns.getNewIndexPatterns)({
    config: _static_globals.Globals.app.config,
    dataset,
    moduleType,
    ccs: req.payload.ccs
  });

  const metric = _metrics.ElasticsearchMetric.getMetricFields();

  const filters = [{
    bool: {
      should: [{
        term: {
          'index_stats.index': indexUuid
        }
      }, {
        term: {
          'elasticsearch.index.name': indexUuid
        }
      }]
    }
  }];
  const params = {
    index: indexPatterns,
    size: 1,
    ignore_unavailable: true,
    body: {
      sort: {
        timestamp: {
          order: 'desc',
          unmapped_type: 'long'
        }
      },
      query: (0, _create_query.createQuery)({
        type,
        dsDataset: `${moduleType}.${dataset}`,
        metricset: dataset,
        start,
        end,
        clusterUuid,
        metric,
        filters
      })
    }
  };
  const {
    callWithRequest
  } = req.server.plugins.elasticsearch.getCluster('monitoring');
  return callWithRequest(req, 'search', params).then(handleResponse(shardStats, indexUuid));
}