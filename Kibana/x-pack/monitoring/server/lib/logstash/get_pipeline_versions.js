"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._handleResponse = _handleResponse;
exports.getPipelineVersions = getPipelineVersions;

var _lodash = require("lodash");

var _create_query = require("../create_query");

var _metrics = require("../metrics");

var _get_index_patterns = require("../cluster/get_index_patterns");

var _static_globals = require("../../static_globals");

var _merge_pipeline_versions = require("./merge_pipeline_versions");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createScopedAgg = (pipelineId, maxBucketSize) => {
  return statsPath => {
    const byPipelineHash = {
      by_pipeline_hash: {
        terms: {
          field: `${statsPath}.pipelines.hash`,
          size: maxBucketSize,
          order: {
            'path_to_root>first_seen': 'desc'
          }
        },
        aggs: {
          path_to_root: {
            reverse_nested: {},
            aggs: {
              first_seen: {
                min: {
                  field: `${statsPath}.timestamp`
                }
              },
              last_seen: {
                max: {
                  field: `${statsPath}.timestamp`
                }
              }
            }
          }
        }
      }
    };
    return {
      nested: {
        path: `${statsPath}.pipelines`
      },
      aggs: {
        scoped: {
          filter: {
            bool: {
              filter: [{
                term: {
                  [`${statsPath}.pipelines.id`]: pipelineId
                }
              }]
            }
          },
          aggs: byPipelineHash
        }
      }
    };
  };
};

function fetchPipelineVersions({
  req,
  clusterUuid,
  pipelineId
}) {
  const dataset = 'node_stats';
  const type = 'logstash_stats';
  const moduleType = 'logstash';
  const indexPatterns = (0, _get_index_patterns.getNewIndexPatterns)({
    config: _static_globals.Globals.app.config,
    ccs: req.payload.ccs,
    moduleType,
    dataset
  });
  const config = req.server.config;
  const {
    callWithRequest
  } = req.server.plugins.elasticsearch.getCluster('monitoring');
  const filters = [{
    bool: {
      should: [{
        nested: {
          path: 'logstash_stats.pipelines',
          ignore_unmapped: true,
          query: {
            bool: {
              filter: [{
                term: {
                  'logstash_stats.pipelines.id': pipelineId
                }
              }]
            }
          }
        }
      }, {
        nested: {
          path: 'logstash.node.stats.pipelines',
          ignore_unmapped: true,
          query: {
            bool: {
              filter: [{
                term: {
                  'logstash.node.stats.pipelines.id': pipelineId
                }
              }]
            }
          }
        }
      }]
    }
  }];
  const query = (0, _create_query.createQuery)({
    type,
    dsDataset: `${moduleType}.${dataset}`,
    metricset: dataset,
    metric: _metrics.LogstashMetric.getMetricFields(),
    clusterUuid,
    filters
  });
  const pipelineAggregation = createScopedAgg(pipelineId, config.ui.max_bucket_size);
  const aggs = {
    pipelines: pipelineAggregation('logstash_stats'),
    pipelines_mb: pipelineAggregation('logstash.node.stats')
  };
  const params = {
    index: indexPatterns,
    size: 0,
    ignore_unavailable: true,
    body: {
      sort: {
        timestamp: {
          order: 'desc',
          unmapped_type: 'long'
        }
      },
      query,
      aggs
    }
  };
  return callWithRequest(req, 'search', params);
}

function _handleResponse(response) {
  const pipelines = (0, _lodash.get)(response, 'aggregations.pipelines.scoped.by_pipeline_hash.buckets', []);
  const pipelinesMb = (0, _lodash.get)(response, 'aggregations.pipelines_mb.scoped.by_pipeline_hash.buckets', []);
  const versions = pipelines.concat(pipelinesMb).map(pipelineHash => ({
    hash: pipelineHash.key,
    firstSeen: (0, _lodash.get)(pipelineHash, 'path_to_root.first_seen.value'),
    lastSeen: (0, _lodash.get)(pipelineHash, 'path_to_root.last_seen.value')
  })); // we could have continuous data about a pipeline version spread across legacy and
  // metricbeat indices, make sure to join the start and end dates for these occurrences

  const uniqVersions = (0, _merge_pipeline_versions.mergePipelineVersions)(versions);
  return (0, _lodash.orderBy)(uniqVersions, 'firstSeen', 'desc');
}

async function getPipelineVersions(args) {
  const response = await fetchPipelineVersions(args);
  return _handleResponse(response);
}