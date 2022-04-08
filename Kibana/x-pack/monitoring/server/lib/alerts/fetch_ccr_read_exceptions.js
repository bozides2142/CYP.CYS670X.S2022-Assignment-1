"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchCCRReadExceptions = fetchCCRReadExceptions;

var _lodash = require("lodash");

var _get_index_patterns = require("../cluster/get_index_patterns");

var _create_dataset_query_filter = require("./create_dataset_query_filter");

var _static_globals = require("../../static_globals");

var _ccs_utils = require("../../../common/ccs_utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function fetchCCRReadExceptions(esClient, startMs, endMs, size, filterQuery) {
  var _response$aggregation;

  const indexPatterns = (0, _get_index_patterns.getNewIndexPatterns)({
    config: _static_globals.Globals.app.config,
    moduleType: 'elasticsearch',
    dataset: 'ccr',
    ccs: (0, _ccs_utils.getConfigCcs)(_static_globals.Globals.app.config) ? '*' : undefined
  });
  const params = {
    index: indexPatterns,
    filter_path: ['aggregations.remote_clusters.buckets'],
    body: {
      size: 0,
      query: {
        bool: {
          filter: [{
            bool: {
              should: [{
                nested: {
                  ignore_unmapped: true,
                  path: 'ccr_stats.read_exceptions',
                  query: {
                    exists: {
                      field: 'ccr_stats.read_exceptions.exception'
                    }
                  }
                }
              }, {
                nested: {
                  ignore_unmapped: true,
                  path: 'elasticsearch.ccr.read_exceptions',
                  query: {
                    exists: {
                      field: 'elasticsearch.ccr.read_exceptions.exception'
                    }
                  }
                }
              }],
              minimum_should_match: 1
            }
          }, (0, _create_dataset_query_filter.createDatasetFilter)('ccr_stats', 'ccr', 'elasticsearch.ccr'), {
            range: {
              timestamp: {
                format: 'epoch_millis',
                gte: startMs,
                lte: endMs
              }
            }
          }]
        }
      },
      aggs: {
        remote_clusters: {
          terms: {
            field: 'ccr_stats.remote_cluster',
            size
          },
          aggs: {
            follower_indices: {
              terms: {
                field: 'ccr_stats.follower_index',
                size
              },
              aggs: {
                hits: {
                  top_hits: {
                    sort: [{
                      timestamp: {
                        order: 'desc',
                        unmapped_type: 'long'
                      }
                    }],
                    _source: {
                      includes: ['cluster_uuid', 'elasticsearch.cluster.id', 'ccr_stats.read_exceptions', 'elasticsearch.ccr.read_exceptions', 'ccr_stats.shard_id', 'elasticsearch.ccr.shard_id', 'ccr_stats.leader_index', 'elasticsearch.ccr.leader.index']
                    },
                    size: 1
                  }
                }
              }
            }
          }
        }
      }
    }
  };

  try {
    if (filterQuery) {
      const filterQueryObject = JSON.parse(filterQuery);
      params.body.query.bool.filter.push(filterQueryObject);
    }
  } catch (e) {// meh
  }

  const {
    body: response
  } = await esClient.search(params);
  const stats = []; // @ts-expect-error declare aggegations type explicitly

  const {
    buckets: remoteClusterBuckets = []
  } = (_response$aggregation = response.aggregations) === null || _response$aggregation === void 0 ? void 0 : _response$aggregation.remote_clusters;

  if (!(remoteClusterBuckets !== null && remoteClusterBuckets !== void 0 && remoteClusterBuckets.length)) {
    return stats;
  }

  for (const remoteClusterBucket of remoteClusterBuckets) {
    const followerIndicesBuckets = remoteClusterBucket.follower_indices.buckets;
    const remoteCluster = remoteClusterBucket.key;

    for (const followerIndexBucket of followerIndicesBuckets) {
      const followerIndex = followerIndexBucket.key;
      const clusterUuid = (0, _lodash.get)(followerIndexBucket, 'hits.hits.hits[0]._source.cluster_uuid') || (0, _lodash.get)(followerIndexBucket, 'hits.hits.hits[0]_source.elasticsearch.cluster.id');
      const monitoringIndexName = (0, _lodash.get)(followerIndexBucket, 'hits.hits.hits[0]._index');
      const ccrStats = (0, _lodash.get)(followerIndexBucket, 'hits.hits.hits[0]._source.ccr_stats') || (0, _lodash.get)(followerIndexBucket, 'hits.hits.hits[0]._source.elasticsearch.ccr');
      const {
        read_exceptions: readExceptions,
        shard_id: shardId
      } = ccrStats;
      const leaderIndex = ccrStats.leaderIndex || ccrStats.leader.index;
      const {
        exception: lastReadException
      } = readExceptions[readExceptions.length - 1];
      stats.push({
        clusterUuid,
        remoteCluster,
        followerIndex,
        shardId,
        leaderIndex,
        lastReadException,
        ccs: monitoringIndexName.includes(':') ? monitoringIndexName.split(':')[0] : null
      });
    }
  }

  return stats;
}