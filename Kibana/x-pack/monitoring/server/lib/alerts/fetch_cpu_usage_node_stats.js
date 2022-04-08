"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchCpuUsageNodeStats = fetchCpuUsageNodeStats;

var _lodash = require("lodash");

var _moment = _interopRequireDefault(require("moment"));

var _constants = require("../../../common/constants");

var _create_dataset_query_filter = require("./create_dataset_query_filter");

var _get_index_patterns = require("../cluster/get_index_patterns");

var _static_globals = require("../../static_globals");

var _ccs_utils = require("../../../common/ccs_utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function fetchCpuUsageNodeStats(esClient, clusters, startMs, endMs, size, filterQuery) {
  // Using pure MS didn't seem to work well with the date_histogram interval
  // but minutes does
  const intervalInMinutes = _moment.default.duration(endMs - startMs).asMinutes();

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
            size,
            include: clusters.map(cluster => cluster.clusterUuid)
          },
          aggs: {
            nodes: {
              terms: {
                field: 'node_stats.node_id',
                size
              },
              aggs: {
                index: {
                  terms: {
                    field: '_index',
                    size: 1
                  }
                },
                average_cpu: {
                  avg: {
                    field: 'node_stats.process.cpu.percent'
                  }
                },
                average_quota: {
                  avg: {
                    field: 'node_stats.os.cgroup.cpu.cfs_quota_micros'
                  }
                },
                name: {
                  terms: {
                    field: 'source_node.name',
                    size: 1
                  }
                },
                histo: {
                  date_histogram: {
                    field: 'timestamp',
                    fixed_interval: `${intervalInMinutes}m`
                  },
                  aggs: {
                    average_periods: {
                      max: {
                        field: 'node_stats.os.cgroup.cpu.stat.number_of_elapsed_periods'
                      }
                    },
                    average_usage: {
                      max: {
                        field: 'node_stats.os.cgroup.cpuacct.usage_nanos'
                      }
                    },
                    usage_deriv: {
                      derivative: {
                        buckets_path: 'average_usage',
                        gap_policy: 'skip',
                        unit: _constants.NORMALIZED_DERIVATIVE_UNIT
                      }
                    },
                    periods_deriv: {
                      derivative: {
                        buckets_path: 'average_periods',
                        gap_policy: 'skip',
                        unit: _constants.NORMALIZED_DERIVATIVE_UNIT
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
  const stats = [];
  const clusterBuckets = (0, _lodash.get)(response, 'aggregations.clusters.buckets', []);

  for (const clusterBucket of clusterBuckets) {
    for (const node of clusterBucket.nodes.buckets) {
      const lastBucket = (0, _lodash.get)(node, 'histo.buckets[1]', {});
      const indexName = (0, _lodash.get)(node, 'index.buckets[0].key', '');
      const stat = {
        clusterUuid: clusterBucket.key,
        nodeId: node.key,
        nodeName: (0, _lodash.get)(node, 'name.buckets[0].key'),
        cpuUsage: (0, _lodash.get)(node, 'average_cpu.value'),
        containerUsage: (0, _lodash.get)(lastBucket, 'usage_deriv.normalized_value'),
        containerPeriods: (0, _lodash.get)(lastBucket, 'periods_deriv.normalized_value'),
        containerQuota: (0, _lodash.get)(node, 'average_quota.value'),
        ccs: indexName.includes(':') ? indexName.split(':')[0] : null
      };
      stats.push(stat);
    }
  }

  return stats;
}