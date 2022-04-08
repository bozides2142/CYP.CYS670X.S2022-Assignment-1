"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getShardStats = getShardStats;
exports.handleResponse = handleResponse;

var _lodash = require("lodash");

var _create_query = require("../../create_query");

var _metrics = require("../../metrics");

var _normalize_shard_objects = require("./normalize_shard_objects");

var _get_shard_stat_aggs = require("./get_shard_stat_aggs");

var _calculate_shard_stat_indices_totals = require("./calculate_shard_stat_indices_totals");

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
// @ts-ignore


function handleResponse(resp, includeNodes, includeIndices, cluster) {
  let indices;
  let indicesTotals;
  let nodes;
  const buckets = (0, _lodash.get)(resp, 'aggregations.indices.buckets');

  if (buckets && buckets.length !== 0) {
    indices = buckets.reduce(_normalize_shard_objects.normalizeIndexShards, {});
    indicesTotals = (0, _calculate_shard_stat_indices_totals.calculateIndicesTotals)(indices);
  }

  if (includeNodes) {
    var _resp$aggregations$no, _resp$aggregations;

    const masterNode = (0, _lodash.get)(cluster, 'elasticsearch.cluster.stats.state.master_node', (0, _lodash.get)(cluster, 'cluster_state.master_node'));
    nodes = (_resp$aggregations$no = (_resp$aggregations = resp.aggregations) === null || _resp$aggregations === void 0 ? void 0 : _resp$aggregations.nodes.buckets.reduce((0, _normalize_shard_objects.normalizeNodeShards)(masterNode), {})) !== null && _resp$aggregations$no !== void 0 ? _resp$aggregations$no : [];
  }

  return {
    indicesTotals,
    indices: includeIndices ? indices : undefined,
    nodes
  };
}

function getShardStats(req, cluster, {
  includeNodes = false,
  includeIndices = false,
  indexName = null,
  nodeUuid = null
} = {}) {
  var _cluster$cluster_stat, _cluster$elasticsearc, _cluster$elasticsearc2, _cluster$elasticsearc3, _cluster$elasticsearc4, _cluster$cluster_uuid, _cluster$elasticsearc5, _cluster$elasticsearc6;

  const dataset = 'shard'; // data_stream.dataset

  const type = 'shards'; // legacy

  const moduleType = 'elasticsearch';
  const indexPatterns = (0, _get_index_patterns.getNewIndexPatterns)({
    config: _static_globals.Globals.app.config,
    ccs: req.payload.ccs,
    moduleType,
    dataset
  });
  const config = req.server.config;

  const metric = _metrics.ElasticsearchMetric.getMetricFields();

  const filters = [];

  if ((_cluster$cluster_stat = cluster.cluster_state) !== null && _cluster$cluster_stat !== void 0 && _cluster$cluster_stat.state_uuid) {
    filters.push({
      term: {
        state_uuid: cluster.cluster_state.state_uuid
      }
    });
  } else if ((_cluster$elasticsearc = cluster.elasticsearch) !== null && _cluster$elasticsearc !== void 0 && (_cluster$elasticsearc2 = _cluster$elasticsearc.cluster) !== null && _cluster$elasticsearc2 !== void 0 && (_cluster$elasticsearc3 = _cluster$elasticsearc2.stats) !== null && _cluster$elasticsearc3 !== void 0 && (_cluster$elasticsearc4 = _cluster$elasticsearc3.state) !== null && _cluster$elasticsearc4 !== void 0 && _cluster$elasticsearc4.state_uuid) {
    filters.push({
      term: {
        'elasticsearch.cluster.stats.state.state_uuid': cluster.elasticsearch.cluster.stats.state.state_uuid
      }
    });
  }

  if (indexName) {
    filters.push({
      bool: {
        should: [{
          term: {
            'shard.index': indexName
          }
        }, {
          term: {
            'elasticsearch.index.name': indexName
          }
        }]
      }
    });
  }

  if (nodeUuid) {
    filters.push({
      bool: {
        should: [{
          term: {
            'shard.node': nodeUuid
          }
        }, {
          term: {
            'elasticsearch.node.id': nodeUuid
          }
        }]
      }
    });
  }

  const params = {
    index: indexPatterns,
    size: 0,
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
        clusterUuid: (_cluster$cluster_uuid = cluster.cluster_uuid) !== null && _cluster$cluster_uuid !== void 0 ? _cluster$cluster_uuid : (_cluster$elasticsearc5 = cluster.elasticsearch) === null || _cluster$elasticsearc5 === void 0 ? void 0 : (_cluster$elasticsearc6 = _cluster$elasticsearc5.cluster) === null || _cluster$elasticsearc6 === void 0 ? void 0 : _cluster$elasticsearc6.id,
        metric,
        filters
      }),
      aggs: { ...(0, _get_shard_stat_aggs.getShardAggs)(config, includeNodes, includeIndices)
      }
    }
  };
  const {
    callWithRequest
  } = req.server.plugins.elasticsearch.getCluster('monitoring');
  return callWithRequest(req, 'search', params).then(resp => {
    return handleResponse(resp, includeNodes, includeIndices, cluster);
  });
}