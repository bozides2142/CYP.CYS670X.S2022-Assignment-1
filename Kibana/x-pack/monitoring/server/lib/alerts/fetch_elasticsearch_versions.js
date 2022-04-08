"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchElasticsearchVersions = fetchElasticsearchVersions;

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


async function fetchElasticsearchVersions(esClient, clusters, size, filterQuery) {
  var _response$hits$hits, _response$hits;

  const indexPatterns = (0, _get_index_patterns.getNewIndexPatterns)({
    config: _static_globals.Globals.app.config,
    moduleType: 'elasticsearch',
    dataset: 'cluster_stats',
    ccs: (0, _ccs_utils.getConfigCcs)(_static_globals.Globals.app.config) ? '*' : undefined
  });
  const params = {
    index: indexPatterns,
    filter_path: ['hits.hits._source.cluster_stats.nodes.versions', 'hits.hits._source.elasticsearch.cluster.stats.nodes.versions', 'hits.hits._index', 'hits.hits._source.cluster_uuid', 'hits.hits._source.elasticsearch.cluster.id'],
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
    var _ref, _cluster_stats$nodes$, _cluster_stats, _cluster_stats$nodes, _elasticsearch, _elasticsearch$cluste, _elasticsearch$cluste2, _elasticsearch$cluste3, _elasticsearch2, _elasticsearch2$clust;

    const versions = (_ref = (_cluster_stats$nodes$ = (_cluster_stats = hit._source.cluster_stats) === null || _cluster_stats === void 0 ? void 0 : (_cluster_stats$nodes = _cluster_stats.nodes) === null || _cluster_stats$nodes === void 0 ? void 0 : _cluster_stats$nodes.versions) !== null && _cluster_stats$nodes$ !== void 0 ? _cluster_stats$nodes$ : (_elasticsearch = hit._source.elasticsearch) === null || _elasticsearch === void 0 ? void 0 : (_elasticsearch$cluste = _elasticsearch.cluster) === null || _elasticsearch$cluste === void 0 ? void 0 : (_elasticsearch$cluste2 = _elasticsearch$cluste.stats) === null || _elasticsearch$cluste2 === void 0 ? void 0 : (_elasticsearch$cluste3 = _elasticsearch$cluste2.nodes) === null || _elasticsearch$cluste3 === void 0 ? void 0 : _elasticsearch$cluste3.versions) !== null && _ref !== void 0 ? _ref : [];
    return {
      versions,
      clusterUuid: ((_elasticsearch2 = hit._source.elasticsearch) === null || _elasticsearch2 === void 0 ? void 0 : (_elasticsearch2$clust = _elasticsearch2.cluster) === null || _elasticsearch2$clust === void 0 ? void 0 : _elasticsearch2$clust.id) || hit._source.cluster_uuid,
      ccs: hit._index.includes(':') ? hit._index.split(':')[0] : undefined
    };
  });
}