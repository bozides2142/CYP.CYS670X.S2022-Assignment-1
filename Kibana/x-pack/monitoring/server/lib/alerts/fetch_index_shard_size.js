"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchIndexShardSize = fetchIndexShardSize;

var _es_glob_patterns = require("../../../common/es_glob_patterns");

var _create_dataset_query_filter = require("./create_dataset_query_filter");

var _static_globals = require("../../static_globals");

var _ccs_utils = require("../../../common/ccs_utils");

var _get_index_patterns = require("../cluster/get_index_patterns");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const memoizedIndexPatterns = globPatterns => {
  const createRegExPatterns = () => _es_glob_patterns.ESGlobPatterns.createRegExPatterns(globPatterns);

  return _static_globals.Globals.app.getKeyStoreValue(`large_shard_size_alert::${globPatterns}`, createRegExPatterns);
};

const gbMultiplier = 1000000000;

async function fetchIndexShardSize(esClient, clusters, threshold, shardIndexPatterns, size, filterQuery) {
  var _response$aggregation;

  const indexPatterns = (0, _get_index_patterns.getNewIndexPatterns)({
    config: _static_globals.Globals.app.config,
    moduleType: 'elasticsearch',
    dataset: 'index',
    ccs: (0, _ccs_utils.getConfigCcs)(_static_globals.Globals.app.config) ? '*' : undefined
  });
  const params = {
    index: indexPatterns,
    filter_path: ['aggregations.clusters.buckets'],
    body: {
      size: 0,
      query: {
        bool: {
          filter: [(0, _create_dataset_query_filter.createDatasetFilter)('index_stats', 'index', 'elasticsearch.index'), {
            range: {
              timestamp: {
                gte: 'now-5m'
              }
            }
          }]
        }
      },
      aggs: {
        clusters: {
          terms: {
            include: clusters.map(cluster => cluster.clusterUuid),
            field: 'cluster_uuid',
            size
          },
          aggs: {
            index: {
              terms: {
                field: 'index_stats.index',
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
                      includes: ['_index', 'index_stats.shards.primaries', 'index_stats.primaries.store.size_in_bytes', 'elasticsearch.index.shards.primaries', 'elasticsearch.index.primaries.store.size_in_bytes']
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
  } = await esClient.search(params); // @ts-expect-error declare aggegations type explicitly

  const {
    buckets: clusterBuckets
  } = (_response$aggregation = response.aggregations) === null || _response$aggregation === void 0 ? void 0 : _response$aggregation.clusters;
  const stats = [];

  if (!(clusterBuckets !== null && clusterBuckets !== void 0 && clusterBuckets.length)) {
    return stats;
  }

  const validIndexPatterns = memoizedIndexPatterns(shardIndexPatterns);
  const thresholdBytes = threshold * gbMultiplier;

  for (const clusterBucket of clusterBuckets) {
    const indexBuckets = clusterBucket.index.buckets;
    const clusterUuid = clusterBucket.key;

    for (const indexBucket of indexBuckets) {
      var _indexBucket$hits, _indexBucket$hits$hit, _source$elasticsearch;

      const shardIndex = indexBucket.key;
      const topHit = (_indexBucket$hits = indexBucket.hits) === null || _indexBucket$hits === void 0 ? void 0 : (_indexBucket$hits$hit = _indexBucket$hits.hits) === null || _indexBucket$hits$hit === void 0 ? void 0 : _indexBucket$hits$hit.hits[0];

      if (!topHit || !_es_glob_patterns.ESGlobPatterns.isValid(shardIndex, validIndexPatterns)) {
        continue;
      }

      const {
        _index: monitoringIndexName,
        _source
      } = topHit;
      const indexStats = _source.index_stats || ((_source$elasticsearch = _source.elasticsearch) === null || _source$elasticsearch === void 0 ? void 0 : _source$elasticsearch.index);

      if (!indexStats || !indexStats.primaries) {
        continue;
      }

      const {
        primaries: totalPrimaryShards
      } = indexStats.shards;
      const {
        size_in_bytes: primaryShardSizeBytes = 0
      } = indexStats.primaries.store || {};

      if (!primaryShardSizeBytes || !totalPrimaryShards) {
        continue;
      }
      /**
       * We can only calculate the average primary shard size at this point, since we don't have
       * data (in .monitoring-es* indices) to give us individual shards. This might change in the future
       */


      const avgShardSize = primaryShardSizeBytes / totalPrimaryShards;

      if (avgShardSize < thresholdBytes) {
        continue;
      }

      const shardSize = +(avgShardSize / gbMultiplier).toFixed(2);
      stats.push({
        shardIndex,
        shardSize,
        clusterUuid,
        ccs: monitoringIndexName.includes(':') ? monitoringIndexName.split(':')[0] : undefined
      });
    }
  }

  return stats;
}