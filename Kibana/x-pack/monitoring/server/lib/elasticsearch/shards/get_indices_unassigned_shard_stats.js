"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getIndicesUnassignedShardStats = getIndicesUnassignedShardStats;

var _lodash = require("lodash");

var _create_query = require("../../create_query");

var _metrics = require("../../metrics");

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


async function getUnassignedShardData(req, cluster) {
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
        indices: {
          terms: {
            field: 'shard.index',
            size: maxBucketSize
          },
          aggs: {
            state: {
              filter: {
                terms: {
                  'shard.state': ['UNASSIGNED', 'INITIALIZING']
                }
              },
              aggs: {
                primary: {
                  terms: {
                    field: 'shard.primary',
                    size: 2
                  }
                }
              }
            }
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

async function getIndicesUnassignedShardStats(req, cluster) {
  const response = await getUnassignedShardData(req, cluster);
  const indices = (0, _lodash.get)(response, 'aggregations.indices.buckets', []).reduce((accum, bucket) => {
    const index = bucket.key;
    const states = (0, _lodash.get)(bucket, 'state.primary.buckets', []);
    const unassignedReplica = states.filter(state => state.key_as_string === 'false').reduce((total, state) => total + state.doc_count, 0);
    const unassignedPrimary = states.filter(state => state.key_as_string === 'true').reduce((total, state) => total + state.doc_count, 0);
    let status = 'green';

    if (unassignedReplica > 0) {
      status = 'yellow';
    }

    if (unassignedPrimary > 0) {
      status = 'red';
    }

    accum[index] = {
      unassigned: {
        primary: unassignedPrimary,
        replica: unassignedReplica
      },
      status
    };
    return accum;
  }, {});
  const indicesTotals = (0, _calculate_shard_stat_indices_totals.calculateIndicesTotals)(indices);
  return {
    indices,
    indicesTotals
  };
}