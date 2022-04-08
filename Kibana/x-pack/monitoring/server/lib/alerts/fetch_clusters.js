"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchClusters = fetchClusters;

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


async function fetchClusters(esClient, rangeFilter = {
  timestamp: {
    gte: 'now-2m'
  }
}) {
  const indexPatterns = (0, _get_index_patterns.getNewIndexPatterns)({
    config: _static_globals.Globals.app.config,
    moduleType: 'elasticsearch',
    dataset: 'cluster_stats',
    ccs: (0, _ccs_utils.getConfigCcs)(_static_globals.Globals.app.config) ? '*' : undefined
  });
  const params = {
    index: indexPatterns,
    filter_path: ['hits.hits._source.cluster_settings.cluster.metadata.display_name', 'hits.hits._source.cluster_uuid', 'hits.hits._source.elasticsearch.cluster.id', 'hits.hits._source.cluster_name', 'hits.hits._source.elasticsearch.cluster.name'],
    body: {
      size: 1000,
      query: {
        bool: {
          filter: [(0, _create_dataset_query_filter.createDatasetFilter)('cluster_stats', 'cluster_stats', 'elasticsearch.cluster_stats'), {
            range: rangeFilter
          }]
        }
      },
      collapse: {
        field: 'cluster_uuid'
      }
    }
  };
  const {
    body: response
  } = await esClient.search(params);
  return (0, _lodash.get)(response, 'hits.hits', []).map(hit => {
    const clusterName = (0, _lodash.get)(hit, '_source.cluster_settings.cluster.metadata.display_name') || (0, _lodash.get)(hit, '_source.cluster_name') || (0, _lodash.get)(hit, '_source.elasticsearch.cluster.name') || (0, _lodash.get)(hit, '_source.cluster_uuid') || (0, _lodash.get)(hit, '_source.elasticsearch.cluster.id');
    return {
      clusterUuid: (0, _lodash.get)(hit, '_source.cluster_uuid') || (0, _lodash.get)(hit, '_source.elasticsearch.cluster.id'),
      clusterName
    };
  });
}