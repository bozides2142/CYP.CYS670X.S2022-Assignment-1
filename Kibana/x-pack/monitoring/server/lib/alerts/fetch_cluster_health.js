"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchClusterHealth = fetchClusterHealth;

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


async function fetchClusterHealth(esClient, clusters, filterQuery) {
  var _response$hits$hits, _response$hits;

  const indexPatterns = (0, _get_index_patterns.getNewIndexPatterns)({
    config: _static_globals.Globals.app.config,
    moduleType: 'elasticsearch',
    dataset: 'cluster_stats',
    ccs: (0, _ccs_utils.getConfigCcs)(_static_globals.Globals.app.config) ? '*' : undefined
  });
  const params = {
    index: indexPatterns,
    filter_path: ['hits.hits._source.cluster_state.status', 'hits.hits._source.elasticsearch.cluster.stats.status', 'hits.hits._source.cluster_uuid', 'hits.hits._source.elasticsearch.cluster.id', 'hits.hits._index'],
    body: {
      size: clusters.length,
      sort: [{
        timestamp: {
          order: 'desc',
          unmapped_type: 'long'
        }
      }],
      query: {
        bool: {
          filter: [{
            terms: {
              cluster_uuid: clusters.map(cluster => cluster.clusterUuid)
            }
          }, (0, _create_dataset_query_filter.createDatasetFilter)('cluster_stats', 'cluster_stats', 'elasticsearch.cluster_stats'), {
            range: {
              timestamp: {
                gte: 'now-2m'
              }
            }
          }]
        }
      },
      collapse: {
        field: 'cluster_uuid'
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

  const result = await esClient.search(params);
  const response = result.body;
  return ((_response$hits$hits = (_response$hits = response.hits) === null || _response$hits === void 0 ? void 0 : _response$hits.hits) !== null && _response$hits$hits !== void 0 ? _response$hits$hits : []).map(hit => {
    var _cluster_state, _elasticsearch, _elasticsearch$cluste, _elasticsearch$cluste2, _elasticsearch2, _elasticsearch2$clust;

    return {
      health: ((_cluster_state = hit._source.cluster_state) === null || _cluster_state === void 0 ? void 0 : _cluster_state.status) || ((_elasticsearch = hit._source.elasticsearch) === null || _elasticsearch === void 0 ? void 0 : (_elasticsearch$cluste = _elasticsearch.cluster) === null || _elasticsearch$cluste === void 0 ? void 0 : (_elasticsearch$cluste2 = _elasticsearch$cluste.stats) === null || _elasticsearch$cluste2 === void 0 ? void 0 : _elasticsearch$cluste2.status),
      clusterUuid: hit._source.cluster_uuid || ((_elasticsearch2 = hit._source.elasticsearch) === null || _elasticsearch2 === void 0 ? void 0 : (_elasticsearch2$clust = _elasticsearch2.cluster) === null || _elasticsearch2$clust === void 0 ? void 0 : _elasticsearch2$clust.id),
      ccs: hit._index.includes(':') ? hit._index.split(':')[0] : undefined
    };
  });
}