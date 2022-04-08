"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getClustersState = getClustersState;
exports.handleResponse = handleResponse;

var _lodash = require("lodash");

var _get_index_patterns = require("./get_index_patterns");

var _static_globals = require("../../static_globals");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Augment the {@clusters} with their cluster state's from the {@code response}.
 *
 * @param  {Object} response The response containing each cluster's cluster state
 * @param  {Object} config Used to provide the node resolver
 * @param  {Array} clusters Array of clusters to be augmented
 * @return {Array} Always {@code clusters}.
 */


function handleResponse(response, clusters) {
  var _response$hits$hits, _response$hits;

  const hits = (_response$hits$hits = (_response$hits = response.hits) === null || _response$hits === void 0 ? void 0 : _response$hits.hits) !== null && _response$hits$hits !== void 0 ? _response$hits$hits : [];
  hits.forEach(hit => {
    const currentCluster = hit._source;

    if (currentCluster) {
      const cluster = (0, _lodash.find)(clusters, {
        cluster_uuid: currentCluster.cluster_uuid
      });

      if (cluster) {
        cluster.cluster_state = currentCluster.cluster_state;
      }
    }
  });
  return clusters;
}
/**
 * This will attempt to augment the {@code clusters} with the {@code status}, {@code state_uuid}, and {@code nodes} from
 * their corresponding cluster state.
 *
 * If there is no cluster state available for any cluster, then it will be returned without any cluster state information.
 */


function getClustersState(req, clusters) {
  const clusterUuids = clusters.filter(cluster => {
    var _cluster$elasticsearc, _cluster$elasticsearc2, _cluster$elasticsearc3;

    return !cluster.cluster_state || !((_cluster$elasticsearc = cluster.elasticsearch) !== null && _cluster$elasticsearc !== void 0 && (_cluster$elasticsearc2 = _cluster$elasticsearc.cluster) !== null && _cluster$elasticsearc2 !== void 0 && (_cluster$elasticsearc3 = _cluster$elasticsearc2.stats) !== null && _cluster$elasticsearc3 !== void 0 && _cluster$elasticsearc3.state);
  }).map(cluster => {
    var _cluster$elasticsearc4, _cluster$elasticsearc5;

    return cluster.cluster_uuid || ((_cluster$elasticsearc4 = cluster.elasticsearch) === null || _cluster$elasticsearc4 === void 0 ? void 0 : (_cluster$elasticsearc5 = _cluster$elasticsearc4.cluster) === null || _cluster$elasticsearc5 === void 0 ? void 0 : _cluster$elasticsearc5.id);
  }); // we only need to fetch the cluster state if we don't already have it
  //  newer documents (those from the version 6 schema and later already have the cluster state with cluster stats)

  if (clusterUuids.length === 0) {
    return Promise.resolve(clusters);
  }

  const indexPatterns = (0, _get_index_patterns.getNewIndexPatterns)({
    config: _static_globals.Globals.app.config,
    moduleType: 'elasticsearch',
    ccs: req.payload.ccs
  });
  const params = {
    index: indexPatterns,
    size: clusterUuids.length,
    ignore_unavailable: true,
    filter_path: ['hits.hits._source.cluster_uuid', 'hits.hits._source.elasticsearch.cluster.id', 'hits.hits._source.cluster_state', 'hits.hits._source.elasticsearch.cluster.stats.state'],
    body: {
      query: {
        bool: {
          filter: [{
            term: {
              type: 'cluster_state'
            }
          }, {
            terms: {
              cluster_uuid: clusterUuids
            }
          }]
        }
      },
      collapse: {
        field: 'cluster_uuid'
      },
      sort: {
        timestamp: {
          order: 'desc',
          unmapped_type: 'long'
        }
      }
    }
  };
  const {
    callWithRequest
  } = req.server.plugins.elasticsearch.getCluster('monitoring');
  return callWithRequest(req, 'search', params).then(response => handleResponse(response, clusters));
}