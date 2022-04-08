"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchThreadPoolRejectionStats = fetchThreadPoolRejectionStats;

var _lodash = require("lodash");

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


const invalidNumberValue = value => {
  return isNaN(value) || value === undefined || value === null;
};

const getTopHits = (threadType, order) => ({
  top_hits: {
    sort: [{
      timestamp: {
        order,
        unmapped_type: 'long'
      }
    }],
    _source: {
      includes: [`node_stats.thread_pool.${threadType}.rejected`, `elasticsearch.node.stats.thread_pool.${threadType}.rejected.count`, 'source_node.name', 'elasticsearch.node.name']
    },
    size: 1
  }
});

async function fetchThreadPoolRejectionStats(esClient, clusters, size, threadType, duration, filterQuery) {
  var _response$aggregation;

  const clustersIds = clusters.map(cluster => cluster.clusterUuid);
  const indexPatterns = (0, _get_index_patterns.getNewIndexPatterns)({
    config: _static_globals.Globals.app.config,
    moduleType: 'elasticsearch',
    dataset: 'node_stats',
    ccs: (0, _ccs_utils.getConfigCcs)(_static_globals.Globals.app.config) ? '*' : undefined
  });
  const params = {
    index: indexPatterns,
    filter_path: ['aggregations'],
    body: {
      size: 0,
      query: {
        bool: {
          filter: [{
            terms: {
              cluster_uuid: clustersIds
            }
          }, (0, _create_dataset_query_filter.createDatasetFilter)('node_stats', 'node_stats', 'elasticsearch.node_stats'), {
            range: {
              timestamp: {
                gte: `now-${duration}`
              }
            }
          }]
        }
      },
      aggs: {
        clusters: {
          terms: {
            field: 'cluster_uuid',
            size
          },
          aggs: {
            nodes: {
              terms: {
                field: 'source_node.uuid',
                size
              },
              aggs: {
                most_recent: { ...getTopHits(threadType, 'desc')
                },
                least_recent: { ...getTopHits(threadType, 'asc')
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
  const stats = []; // @ts-expect-error declare type for aggregations explicitly

  const {
    buckets: clusterBuckets
  } = (_response$aggregation = response.aggregations) === null || _response$aggregation === void 0 ? void 0 : _response$aggregation.clusters;

  if (!(clusterBuckets !== null && clusterBuckets !== void 0 && clusterBuckets.length)) {
    return stats;
  }

  for (const clusterBucket of clusterBuckets) {
    for (const node of clusterBucket.nodes.buckets) {
      const mostRecentDoc = (0, _lodash.get)(node, 'most_recent.hits.hits[0]');
      mostRecentDoc.timestamp = mostRecentDoc.sort[0];
      const leastRecentDoc = (0, _lodash.get)(node, 'least_recent.hits.hits[0]');
      leastRecentDoc.timestamp = leastRecentDoc.sort[0];

      if (!mostRecentDoc || mostRecentDoc.timestamp === leastRecentDoc.timestamp) {
        continue;
      }

      const rejectedPath = `_source.node_stats.thread_pool.${threadType}.rejected`;
      const rejectedPathEcs = `_source.elasticsearch.node.stats.thread_pool.${threadType}.rejected.count`;
      const newRejectionCount = Number((0, _lodash.get)(mostRecentDoc, rejectedPath)) || Number((0, _lodash.get)(mostRecentDoc, rejectedPathEcs));
      const oldRejectionCount = Number((0, _lodash.get)(leastRecentDoc, rejectedPath)) || Number((0, _lodash.get)(leastRecentDoc, rejectedPathEcs));

      if (invalidNumberValue(newRejectionCount) || invalidNumberValue(oldRejectionCount)) {
        continue;
      }

      const rejectionCount = oldRejectionCount > newRejectionCount ? newRejectionCount : newRejectionCount - oldRejectionCount;
      const indexName = mostRecentDoc._index;
      const nodeName = (0, _lodash.get)(mostRecentDoc, '_source.source_node.name') || (0, _lodash.get)(mostRecentDoc, '_source.elasticsearch.node.name') || node.key;
      const nodeStat = {
        rejectionCount,
        type: threadType,
        clusterUuid: clusterBucket.key,
        nodeId: node.key,
        nodeName,
        ccs: indexName.includes(':') ? indexName.split(':')[0] : null
      };
      stats.push(nodeStat);
    }
  }

  return stats;
}