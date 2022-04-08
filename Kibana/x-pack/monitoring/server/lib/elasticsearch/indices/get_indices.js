"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildGetIndicesQuery = buildGetIndicesQuery;
exports.getIndices = getIndices;
exports.handleResponse = handleResponse;

var _lodash = require("lodash");

var _i18n = require("@kbn/i18n");

var _metrics = require("../../metrics");

var _create_query = require("../../create_query");

var _calculate_rate = require("../../calculate_rate");

var _shards = require("../shards");

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
// @ts-ignore
// @ts-ignore


function handleResponse(resp, min, max, shardStats) {
  var _resp$hits$hits, _resp$hits; // map the hits


  const hits = (_resp$hits$hits = resp === null || resp === void 0 ? void 0 : (_resp$hits = resp.hits) === null || _resp$hits === void 0 ? void 0 : _resp$hits.hits) !== null && _resp$hits$hits !== void 0 ? _resp$hits$hits : [];
  return hits.map(hit => {
    var _hit$_source$index_st, _hit$_source$elastics, _hit$inner_hits$earli, _hit$inner_hits, _hit$inner_hits$earli2, _hit$inner_hits$earli3, _hit$inner_hits$earli4, _hit$inner_hits2, _hit$inner_hits2$earl, _hit$inner_hits2$earl2, _hit$inner_hits2$earl3, _hit$inner_hits2$earl4, _ref, _hit$_source$timestam, _ref2, _hit$inner_hits$earli5, _hit$inner_hits3, _hit$inner_hits3$earl, _hit$inner_hits3$earl2, _hit$inner_hits3$earl3, _hit$inner_hits4, _hit$inner_hits4$earl, _hit$inner_hits4$earl2, _hit$inner_hits4$earl3, _earliestStats$primar, _stats$primaries, _stats$primaries$inde, _earliestStats$total, _stats$total, _stats$total$search, _ref3, _stats$index, _stats$index2, _stats$primaries2, _stats$primaries2$doc, _stats$total2, _stats$total2$store;

    const stats = (_hit$_source$index_st = hit._source.index_stats) !== null && _hit$_source$index_st !== void 0 ? _hit$_source$index_st : (_hit$_source$elastics = hit._source.elasticsearch) === null || _hit$_source$elastics === void 0 ? void 0 : _hit$_source$elastics.index;
    const earliestStats = (_hit$inner_hits$earli = (_hit$inner_hits = hit.inner_hits) === null || _hit$inner_hits === void 0 ? void 0 : (_hit$inner_hits$earli2 = _hit$inner_hits.earliest) === null || _hit$inner_hits$earli2 === void 0 ? void 0 : (_hit$inner_hits$earli3 = _hit$inner_hits$earli2.hits) === null || _hit$inner_hits$earli3 === void 0 ? void 0 : (_hit$inner_hits$earli4 = _hit$inner_hits$earli3.hits[0]) === null || _hit$inner_hits$earli4 === void 0 ? void 0 : _hit$inner_hits$earli4._source.index_stats) !== null && _hit$inner_hits$earli !== void 0 ? _hit$inner_hits$earli : (_hit$inner_hits2 = hit.inner_hits) === null || _hit$inner_hits2 === void 0 ? void 0 : (_hit$inner_hits2$earl = _hit$inner_hits2.earliest) === null || _hit$inner_hits2$earl === void 0 ? void 0 : (_hit$inner_hits2$earl2 = _hit$inner_hits2$earl.hits) === null || _hit$inner_hits2$earl2 === void 0 ? void 0 : (_hit$inner_hits2$earl3 = _hit$inner_hits2$earl2.hits[0]) === null || _hit$inner_hits2$earl3 === void 0 ? void 0 : (_hit$inner_hits2$earl4 = _hit$inner_hits2$earl3._source.elasticsearch) === null || _hit$inner_hits2$earl4 === void 0 ? void 0 : _hit$inner_hits2$earl4.index;
    const rateOptions = {
      hitTimestamp: (_ref = (_hit$_source$timestam = hit._source.timestamp) !== null && _hit$_source$timestam !== void 0 ? _hit$_source$timestam : hit._source['@timestamp']) !== null && _ref !== void 0 ? _ref : null,
      earliestHitTimestamp: (_ref2 = (_hit$inner_hits$earli5 = (_hit$inner_hits3 = hit.inner_hits) === null || _hit$inner_hits3 === void 0 ? void 0 : (_hit$inner_hits3$earl = _hit$inner_hits3.earliest) === null || _hit$inner_hits3$earl === void 0 ? void 0 : (_hit$inner_hits3$earl2 = _hit$inner_hits3$earl.hits) === null || _hit$inner_hits3$earl2 === void 0 ? void 0 : (_hit$inner_hits3$earl3 = _hit$inner_hits3$earl2.hits[0]) === null || _hit$inner_hits3$earl3 === void 0 ? void 0 : _hit$inner_hits3$earl3._source.timestamp) !== null && _hit$inner_hits$earli5 !== void 0 ? _hit$inner_hits$earli5 : (_hit$inner_hits4 = hit.inner_hits) === null || _hit$inner_hits4 === void 0 ? void 0 : (_hit$inner_hits4$earl = _hit$inner_hits4.earliest) === null || _hit$inner_hits4$earl === void 0 ? void 0 : (_hit$inner_hits4$earl2 = _hit$inner_hits4$earl.hits) === null || _hit$inner_hits4$earl2 === void 0 ? void 0 : (_hit$inner_hits4$earl3 = _hit$inner_hits4$earl2.hits[0]) === null || _hit$inner_hits4$earl3 === void 0 ? void 0 : _hit$inner_hits4$earl3._source['@timestamp']) !== null && _ref2 !== void 0 ? _ref2 : null,
      timeWindowMin: min,
      timeWindowMax: max
    };
    const earliestIndexingHit = earliestStats === null || earliestStats === void 0 ? void 0 : (_earliestStats$primar = earliestStats.primaries) === null || _earliestStats$primar === void 0 ? void 0 : _earliestStats$primar.indexing;
    const {
      rate: indexRate
    } = (0, _calculate_rate.calculateRate)({
      latestTotal: stats === null || stats === void 0 ? void 0 : (_stats$primaries = stats.primaries) === null || _stats$primaries === void 0 ? void 0 : (_stats$primaries$inde = _stats$primaries.indexing) === null || _stats$primaries$inde === void 0 ? void 0 : _stats$primaries$inde.index_total,
      earliestTotal: earliestIndexingHit === null || earliestIndexingHit === void 0 ? void 0 : earliestIndexingHit.index_total,
      ...rateOptions
    });
    const earliestSearchHit = earliestStats === null || earliestStats === void 0 ? void 0 : (_earliestStats$total = earliestStats.total) === null || _earliestStats$total === void 0 ? void 0 : _earliestStats$total.search;
    const {
      rate: searchRate
    } = (0, _calculate_rate.calculateRate)({
      latestTotal: stats === null || stats === void 0 ? void 0 : (_stats$total = stats.total) === null || _stats$total === void 0 ? void 0 : (_stats$total$search = _stats$total.search) === null || _stats$total$search === void 0 ? void 0 : _stats$total$search.query_total,
      earliestTotal: earliestSearchHit === null || earliestSearchHit === void 0 ? void 0 : earliestSearchHit.query_total,
      ...rateOptions
    });
    const shardStatsForIndex = (0, _lodash.get)(shardStats, ['indices', (_ref3 = (_stats$index = stats === null || stats === void 0 ? void 0 : stats.index) !== null && _stats$index !== void 0 ? _stats$index : stats === null || stats === void 0 ? void 0 : stats.name) !== null && _ref3 !== void 0 ? _ref3 : '']);
    let status;
    let statusSort;
    let unassignedShards;

    if (shardStatsForIndex && shardStatsForIndex.status) {
      status = shardStatsForIndex.status;
      unassignedShards = (0, _shards.getUnassignedShards)(shardStatsForIndex); // create a numerical status value for sorting

      if (status === 'green') {
        statusSort = 1;
      } else if (status === 'yellow') {
        statusSort = 2;
      } else {
        statusSort = 3;
      }
    } else {
      status = _i18n.i18n.translate('xpack.monitoring.es.indices.deletedClosedStatusLabel', {
        defaultMessage: 'Deleted / Closed'
      });
      statusSort = 0;
    }

    return {
      name: (_stats$index2 = stats === null || stats === void 0 ? void 0 : stats.index) !== null && _stats$index2 !== void 0 ? _stats$index2 : stats === null || stats === void 0 ? void 0 : stats.name,
      status,
      doc_count: stats === null || stats === void 0 ? void 0 : (_stats$primaries2 = stats.primaries) === null || _stats$primaries2 === void 0 ? void 0 : (_stats$primaries2$doc = _stats$primaries2.docs) === null || _stats$primaries2$doc === void 0 ? void 0 : _stats$primaries2$doc.count,
      data_size: stats === null || stats === void 0 ? void 0 : (_stats$total2 = stats.total) === null || _stats$total2 === void 0 ? void 0 : (_stats$total2$store = _stats$total2.store) === null || _stats$total2$store === void 0 ? void 0 : _stats$total2$store.size_in_bytes,
      index_rate: indexRate,
      search_rate: searchRate,
      unassigned_shards: unassignedShards,
      status_sort: statusSort
    };
  });
}

function buildGetIndicesQuery(req, clusterUuid, {
  start,
  end,
  size,
  showSystemIndices = false
}) {
  const filters = [];

  if (!showSystemIndices) {
    filters.push({
      bool: {
        must_not: [{
          prefix: {
            'index_stats.index': '.'
          }
        }]
      }
    });
  }

  const metricFields = _metrics.ElasticsearchMetric.getMetricFields();

  const dataset = 'index'; // data_stream.dataset

  const type = 'index_stats'; // legacy

  const moduleType = 'elasticsearch';
  const indexPatterns = (0, _get_index_patterns.getNewIndexPatterns)({
    config: _static_globals.Globals.app.config,
    ccs: req.payload.ccs,
    dataset,
    moduleType
  });
  return {
    index: indexPatterns,
    size,
    ignore_unavailable: true,
    filter_path: [// only filter path can filter for inner_hits
    'hits.hits._source.index_stats.index', 'hits.hits._source.elasticsearch.index.name', 'hits.hits._source.index_stats.primaries.docs.count', 'hits.hits._source.elasticsearch.index.primaries.docs.count', 'hits.hits._source.index_stats.total.store.size_in_bytes', 'hits.hits._source.elasticsearch.index.total.store.size_in_bytes', // latest hits for calculating metrics
    'hits.hits._source.timestamp', 'hits.hits._source.@timestamp', 'hits.hits._source.index_stats.primaries.indexing.index_total', 'hits.hits._source.elasticsearch.index.primaries.indexing.index_total', 'hits.hits._source.index_stats.total.search.query_total', 'hits.hits._source.elasticsearch.index.total.search.query_total', // earliest hits for calculating metrics
    'hits.hits.inner_hits.earliest.hits.hits._source.timestamp', 'hits.hits.inner_hits.earliest.hits.hits._source.@timestamp', 'hits.hits.inner_hits.earliest.hits.hits._source.index_stats.primaries.indexing.index_total', 'hits.hits.inner_hits.earliest.hits.hits._source.elasticsearch.index.primaries.indexing.index_total', 'hits.hits.inner_hits.earliest.hits.hits._source.index_stats.total.search.query_total', 'hits.hits.inner_hits.earliest.hits.hits._source.elasticsearch.index.total.search.query_total'],
    body: {
      query: (0, _create_query.createQuery)({
        type,
        dsDataset: `${moduleType}.${dataset}`,
        metricset: dataset,
        start,
        end,
        clusterUuid,
        metric: metricFields,
        filters
      }),
      collapse: {
        field: 'index_stats.index',
        inner_hits: {
          name: 'earliest',
          size: 1,
          sort: [{
            timestamp: {
              order: 'asc',
              unmapped_type: 'long'
            }
          }]
        }
      },
      sort: [{
        timestamp: {
          order: 'desc',
          unmapped_type: 'long'
        }
      }]
    }
  };
}

function getIndices(req, showSystemIndices = false, shardStats) {
  const {
    min: start,
    max: end
  } = req.payload.timeRange;
  const clusterUuid = req.params.clusterUuid;
  const config = req.server.config;
  const params = buildGetIndicesQuery(req, clusterUuid, {
    start,
    end,
    showSystemIndices,
    size: config.ui.max_bucket_size
  });
  const {
    callWithRequest
  } = req.server.plugins.elasticsearch.getCluster('monitoring');
  return callWithRequest(req, 'search', params).then(resp => handleResponse(resp, start, end, shardStats));
}