"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchMissingMonitoringData = fetchMissingMonitoringData;

var _lodash = require("lodash");

var _static_globals = require("../../static_globals");

var _ccs_utils = require("../../../common/ccs_utils");

var _get_index_patterns = require("../cluster/get_index_patterns");

var _create_dataset_query_filter = require("./create_dataset_query_filter");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// TODO: only Elasticsearch until we can figure out how to handle upgrades for the rest of the stack
// https://github.com/elastic/kibana/issues/83309


async function fetchMissingMonitoringData(esClient, clusters, size, nowInMs, startMs, filterQuery) {
  const endMs = nowInMs; // changing this to only search ES because of changes related to https://github.com/elastic/kibana/issues/83309

  const indexPatterns = (0, _get_index_patterns.getNewIndexPatterns)({
    config: _static_globals.Globals.app.config,
    moduleType: 'elasticsearch',
    dataset: 'node_stats',
    ccs: (0, _ccs_utils.getConfigCcs)(_static_globals.Globals.app.config) ? '*' : undefined
  });
  const params = {
    index: indexPatterns,
    filter_path: ['aggregations.clusters.buckets'],
    body: {
      size: 0,
      query: {
        bool: {
          filter: [{
            terms: {
              cluster_uuid: clusters.map(cluster => cluster.clusterUuid)
            }
          }, (0, _create_dataset_query_filter.createDatasetFilter)('node_stats', 'node_stats', 'elasticsearch.node_stats'), {
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
        clusters: {
          terms: {
            field: 'cluster_uuid',
            size
          },
          aggs: {
            es_uuids: {
              terms: {
                field: 'node_stats.node_id',
                size
              },
              aggs: {
                most_recent: {
                  max: {
                    field: 'timestamp'
                  }
                },
                document: {
                  top_hits: {
                    size: 1,
                    sort: [{
                      timestamp: {
                        order: 'desc',
                        unmapped_type: 'long'
                      }
                    }],
                    _source: {
                      includes: ['source_node.name', 'elasticsearch.node.name']
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
  const clusterBuckets = (0, _lodash.get)(response, 'aggregations.clusters.buckets', []);
  const uniqueList = {};

  for (const clusterBucket of clusterBuckets) {
    const clusterUuid = clusterBucket.key;
    const uuidBuckets = clusterBucket.es_uuids.buckets;

    for (const uuidBucket of uuidBuckets) {
      const nodeId = uuidBucket.key;
      const indexName = (0, _lodash.get)(uuidBucket, `document.hits.hits[0]._index`);
      const differenceInMs = nowInMs - uuidBucket.most_recent.value;
      const nodeName = (0, _lodash.get)(uuidBucket, `document.hits.hits[0]._source.source_node.name`) || (0, _lodash.get)(uuidBucket, `document.hits.hits[0]._source.elasticsearch.node.name`) || nodeId;
      uniqueList[`${clusterUuid}${nodeId}`] = {
        nodeId,
        nodeName,
        clusterUuid,
        gapDuration: differenceInMs,
        ccs: indexName.includes(':') ? indexName.split(':')[0] : null
      };
    }
  }

  const missingData = Object.values(uniqueList);
  return missingData;
}