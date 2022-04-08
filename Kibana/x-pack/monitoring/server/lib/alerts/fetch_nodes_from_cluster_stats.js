"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchNodesFromClusterStats = fetchNodesFromClusterStats;

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


function formatNode(nodes) {
  if (!nodes) {
    return [];
  }

  return Object.keys(nodes).map(nodeUuid => {
    return {
      nodeUuid,
      nodeEphemeralId: nodes[nodeUuid].ephemeral_id,
      nodeName: nodes[nodeUuid].name
    };
  });
}

async function fetchNodesFromClusterStats(esClient, clusters, filterQuery) {
  var _response$aggregation, _response$aggregation2;

  const indexPatterns = (0, _get_index_patterns.getNewIndexPatterns)({
    config: _static_globals.Globals.app.config,
    moduleType: 'elasticsearch',
    dataset: 'cluster_stats',
    ccs: (0, _ccs_utils.getConfigCcs)(_static_globals.Globals.app.config) ? '*' : undefined
  });
  const params = {
    index: indexPatterns,
    filter_path: ['aggregations.clusters.buckets'],
    body: {
      size: 0,
      sort: [{
        timestamp: {
          order: 'desc',
          unmapped_type: 'long'
        }
      }],
      query: {
        bool: {
          filter: [(0, _create_dataset_query_filter.createDatasetFilter)('cluster_stats', 'cluster_stats', 'elasticsearch.cluster_stats'), {
            range: {
              timestamp: {
                gte: 'now-2m'
              }
            }
          }]
        }
      },
      aggs: {
        clusters: {
          terms: {
            include: clusters.map(cluster => cluster.clusterUuid),
            field: 'cluster_uuid'
          },
          aggs: {
            top: {
              top_hits: {
                sort: [{
                  timestamp: {
                    order: 'desc',
                    unmapped_type: 'long'
                  }
                }],
                _source: {
                  includes: ['cluster_state.nodes', 'elasticsearch.cluster.stats.nodes']
                },
                size: 2
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
  const nodes = []; // @ts-expect-error declare type for aggregations explicitly

  const clusterBuckets = (_response$aggregation = response.aggregations) === null || _response$aggregation === void 0 ? void 0 : (_response$aggregation2 = _response$aggregation.clusters) === null || _response$aggregation2 === void 0 ? void 0 : _response$aggregation2.buckets;

  if (!(clusterBuckets !== null && clusterBuckets !== void 0 && clusterBuckets.length)) {
    return nodes;
  }

  for (const clusterBucket of clusterBuckets) {
    var _hits$0$_source$clust, _hits$1$_source$clust;

    const clusterUuid = clusterBucket.key;
    const hits = clusterBucket.top.hits.hits;
    const indexName = hits[0]._index;
    nodes.push({
      clusterUuid,
      recentNodes: formatNode(((_hits$0$_source$clust = hits[0]._source.cluster_state) === null || _hits$0$_source$clust === void 0 ? void 0 : _hits$0$_source$clust.nodes) || hits[0]._source.elasticsearch.cluster.stats.nodes),
      priorNodes: formatNode(((_hits$1$_source$clust = hits[1]._source.cluster_state) === null || _hits$1$_source$clust === void 0 ? void 0 : _hits$1$_source$clust.nodes) || hits[1]._source.elasticsearch.cluster.stats.nodes),
      ccs: indexName.includes(':') ? indexName.split(':')[0] : undefined
    });
  }

  return nodes;
}