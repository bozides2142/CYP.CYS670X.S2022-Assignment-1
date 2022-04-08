"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchKibanaVersions = fetchKibanaVersions;

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


async function fetchKibanaVersions(esClient, clusters, size, filterQuery) {
  const indexPatterns = (0, _get_index_patterns.getNewIndexPatterns)({
    config: _static_globals.Globals.app.config,
    moduleType: 'kibana',
    dataset: 'stats',
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
              cluster_uuid: clusters.map(cluster => cluster.clusterUuid)
            }
          }, (0, _create_dataset_query_filter.createDatasetFilter)('kibana_stats', 'stats', 'kibana.stats'), {
            range: {
              timestamp: {
                gte: 'now-2m'
              }
            }
          }]
        }
      },
      aggs: {
        index: {
          terms: {
            field: '_index',
            size: 1
          }
        },
        cluster: {
          terms: {
            field: 'cluster_uuid',
            size: 1
          },
          aggs: {
            group_by_kibana: {
              terms: {
                field: 'kibana_stats.kibana.uuid',
                size
              },
              aggs: {
                group_by_version: {
                  terms: {
                    field: 'kibana_stats.kibana.version',
                    size: 1,
                    order: {
                      latest_report: 'desc'
                    }
                  },
                  aggs: {
                    latest_report: {
                      max: {
                        field: 'timestamp'
                      }
                    }
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
  const indexName = (0, _lodash.get)(response, 'aggregations.index.buckets[0].key', '');
  const clusterList = (0, _lodash.get)(response, 'aggregations.cluster.buckets', []);
  return clusterList.map(cluster => {
    const clusterUuid = cluster.key;
    const uuids = (0, _lodash.get)(cluster, 'group_by_kibana.buckets', []);
    const byVersion = {};

    for (const uuid of uuids) {
      const version = (0, _lodash.get)(uuid, 'group_by_version.buckets[0].key', '');

      if (!version) {
        continue;
      }

      byVersion[version] = true;
    }

    return {
      versions: Object.keys(byVersion),
      clusterUuid,
      ccs: indexName.includes(':') ? indexName.split(':')[0] : null
    };
  });
}