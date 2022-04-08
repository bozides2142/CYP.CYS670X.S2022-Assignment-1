"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNodesShardCount = getNodesShardCount;

var _lodash = require("lodash");

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


async function getShardCountPerNode(req, cluster) {
  var _cluster$cluster_stat, _cluster$elasticsearc, _cluster$elasticsearc2, _cluster$elasticsearc3, _cluster$elasticsearc4, _cluster$cluster_uuid, _cluster$elasticsearc9, _cluster$elasticsearc10;

  const config = req.server.config;
  const maxBucketSize = config.ui.max_bucket_size;

  const metric = _metrics.ElasticsearchMetric.getMetricFields();

  const filters = [];

  if ((_cluster$cluster_stat = cluster.cluster_state) !== null && _cluster$cluster_stat !== void 0 && _cluster$cluster_stat.state_uuid) {
    var _cluster$cluster_stat2;

    filters.push({
      term: {
        state_uuid: (_cluster$cluster_stat2 = cluster.cluster_state) === null || _cluster$cluster_stat2 === void 0 ? void 0 : _cluster$cluster_stat2.state_uuid
      }
    });
  } else if ((_cluster$elasticsearc = cluster.elasticsearch) !== null && _cluster$elasticsearc !== void 0 && (_cluster$elasticsearc2 = _cluster$elasticsearc.cluster) !== null && _cluster$elasticsearc2 !== void 0 && (_cluster$elasticsearc3 = _cluster$elasticsearc2.stats) !== null && _cluster$elasticsearc3 !== void 0 && (_cluster$elasticsearc4 = _cluster$elasticsearc3.state) !== null && _cluster$elasticsearc4 !== void 0 && _cluster$elasticsearc4.state_uuid) {
    var _cluster$elasticsearc5, _cluster$elasticsearc6, _cluster$elasticsearc7, _cluster$elasticsearc8;

    filters.push({
      term: {
        'elasticsearch.cluster.stats.state.state_uuid': (_cluster$elasticsearc5 = cluster.elasticsearch) === null || _cluster$elasticsearc5 === void 0 ? void 0 : (_cluster$elasticsearc6 = _cluster$elasticsearc5.cluster) === null || _cluster$elasticsearc6 === void 0 ? void 0 : (_cluster$elasticsearc7 = _cluster$elasticsearc6.stats) === null || _cluster$elasticsearc7 === void 0 ? void 0 : (_cluster$elasticsearc8 = _cluster$elasticsearc7.state) === null || _cluster$elasticsearc8 === void 0 ? void 0 : _cluster$elasticsearc8.state_uuid
      }
    });
  }

  const dataset = 'shard'; // data_stream.dataset

  const type = 'shards'; // legacy

  const moduleType = 'elasticsearch';
  const indexPattern = (0, _get_index_patterns.getNewIndexPatterns)({
    config: _static_globals.Globals.app.config,
    ccs: req.payload.ccs,
    moduleType,
    dataset
  });
  const params = {
    index: indexPattern,
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
        clusterUuid: (_cluster$cluster_uuid = cluster.cluster_uuid) !== null && _cluster$cluster_uuid !== void 0 ? _cluster$cluster_uuid : (_cluster$elasticsearc9 = cluster.elasticsearch) === null || _cluster$elasticsearc9 === void 0 ? void 0 : (_cluster$elasticsearc10 = _cluster$elasticsearc9.cluster) === null || _cluster$elasticsearc10 === void 0 ? void 0 : _cluster$elasticsearc10.id,
        metric,
        filters
      }),
      aggs: {
        nodes: {
          terms: {
            field: 'shard.node',
            size: maxBucketSize
          }
        }
      }
    }
  };
  const {
    callWithRequest
  } = req.server.plugins.elasticsearch.getCluster('monitoring');
  return await callWithRequest(req, 'search', params);
}

async function getNodesShardCount(req, cluster) {
  const response = await getShardCountPerNode(req, cluster);
  const nodes = (0, _lodash.get)(response, 'aggregations.nodes.buckets', []).reduce((accum, bucket) => {
    accum[bucket.key] = {
      shardCount: bucket.doc_count
    };
    return accum;
  }, {});
  return {
    nodes
  };
}