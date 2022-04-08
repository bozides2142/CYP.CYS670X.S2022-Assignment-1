"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getKibanasForClusters = getKibanasForClusters;

var _lodash = require("lodash");

var _create_query = require("../create_query");

var _metrics = require("../metrics");

var _get_index_patterns = require("../cluster/get_index_patterns");

var _static_globals = require("../../static_globals");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 * Get high-level info for Kibanas in a set of clusters
 * The set contains multiple clusters for cluster listing page
 * The set contains single cluster for cluster overview page and cluster status bar

 * Timespan for the data is an interval of time based on calculations of an
 * interval size using the same calculation as determining bucketSize using
 * the timepicker for a chart

 * Returns, for each cluster,
 *  - number of instances
 *  - combined health
 */


function getKibanasForClusters(req, clusters, ccs) {
  const config = req.server.config;
  const start = req.payload.timeRange.min;
  const end = req.payload.timeRange.max;
  const moduleType = 'kibana';
  const type = 'kibana_stats';
  const dataset = 'stats';
  const indexPatterns = (0, _get_index_patterns.getNewIndexPatterns)({
    config: _static_globals.Globals.app.config,
    moduleType,
    dataset,
    ccs
  });
  return Promise.all(clusters.map(cluster => {
    var _cluster$elasticsearc, _cluster$elasticsearc2, _cluster$elasticsearc3;

    const clusterUuid = (_cluster$elasticsearc = (_cluster$elasticsearc2 = cluster.elasticsearch) === null || _cluster$elasticsearc2 === void 0 ? void 0 : (_cluster$elasticsearc3 = _cluster$elasticsearc2.cluster) === null || _cluster$elasticsearc3 === void 0 ? void 0 : _cluster$elasticsearc3.id) !== null && _cluster$elasticsearc !== void 0 ? _cluster$elasticsearc : cluster.cluster_uuid;

    const metric = _metrics.KibanaClusterMetric.getMetricFields();

    const params = {
      index: indexPatterns,
      size: 0,
      ignore_unavailable: true,
      body: {
        query: (0, _create_query.createQuery)({
          type,
          dsDataset: `${moduleType}.${dataset}`,
          metricset: dataset,
          start,
          end,
          clusterUuid,
          metric
        }),
        aggs: {
          kibana_uuids: {
            terms: {
              field: 'kibana_stats.kibana.uuid',
              size: config.ui.max_bucket_size
            },
            aggs: {
              latest_report: {
                terms: {
                  field: 'kibana_stats.timestamp',
                  size: 1,
                  order: {
                    _key: 'desc'
                  }
                },
                aggs: {
                  response_time_max: {
                    max: {
                      field: 'kibana_stats.response_times.max'
                    }
                  },
                  memory_rss: {
                    max: {
                      field: 'kibana_stats.process.memory.resident_set_size_in_bytes'
                    }
                  },
                  memory_heap_size_limit: {
                    max: {
                      field: 'kibana_stats.process.memory.heap.size_limit'
                    }
                  },
                  concurrent_connections: {
                    max: {
                      field: 'kibana_stats.concurrent_connections'
                    }
                  },
                  requests_total: {
                    max: {
                      field: 'kibana_stats.requests.total'
                    }
                  }
                }
              },
              response_time_max_per: {
                max_bucket: {
                  buckets_path: 'latest_report>response_time_max'
                }
              },
              memory_rss_per: {
                max_bucket: {
                  buckets_path: 'latest_report>memory_rss'
                }
              },
              memory_heap_size_limit_per: {
                max_bucket: {
                  buckets_path: 'latest_report>memory_heap_size_limit'
                }
              },
              concurrent_connections_per: {
                max_bucket: {
                  buckets_path: 'latest_report>concurrent_connections'
                }
              },
              requests_total_per: {
                max_bucket: {
                  buckets_path: 'latest_report>requests_total'
                }
              }
            }
          },
          response_time_max: {
            max_bucket: {
              buckets_path: 'kibana_uuids>response_time_max_per'
            }
          },
          memory_rss: {
            sum_bucket: {
              buckets_path: 'kibana_uuids>memory_rss_per'
            }
          },
          memory_heap_size_limit: {
            sum_bucket: {
              buckets_path: 'kibana_uuids>memory_heap_size_limit_per'
            }
          },
          concurrent_connections: {
            sum_bucket: {
              buckets_path: 'kibana_uuids>concurrent_connections_per'
            }
          },
          requests_total: {
            sum_bucket: {
              buckets_path: 'kibana_uuids>requests_total_per'
            }
          },
          status: {
            terms: {
              field: 'kibana_stats.kibana.status',
              order: {
                max_timestamp: 'desc'
              }
            },
            aggs: {
              max_timestamp: {
                max: {
                  field: 'timestamp'
                }
              }
            }
          }
        }
      }
    };
    const {
      callWithRequest
    } = req.server.plugins.elasticsearch.getCluster('monitoring');
    return callWithRequest(req, 'search', params).then(result => {
      var _result$aggregations, _aggregations$kibana_, _aggregations$kibana_2, _aggregations$status$, _aggregations$status;

      const aggregations = (_result$aggregations = result.aggregations) !== null && _result$aggregations !== void 0 ? _result$aggregations : {};
      const kibanaUuids = (_aggregations$kibana_ = (_aggregations$kibana_2 = aggregations.kibana_uuids) === null || _aggregations$kibana_2 === void 0 ? void 0 : _aggregations$kibana_2.buckets) !== null && _aggregations$kibana_ !== void 0 ? _aggregations$kibana_ : [];
      const statusBuckets = (_aggregations$status$ = (_aggregations$status = aggregations.status) === null || _aggregations$status === void 0 ? void 0 : _aggregations$status.buckets) !== null && _aggregations$status$ !== void 0 ? _aggregations$status$ : []; // everything is initialized such that it won't impact any rollup

      let status = null;
      let requestsTotal = 0;
      let connections = 0;
      let responseTime = 0;
      let memorySize = 0;
      let memoryLimit = 0; // if the cluster has kibana instances at all

      if (kibanaUuids.length) {
        var _aggregations$request, _aggregations$concurr, _aggregations$respons, _aggregations$memory_, _aggregations$memory_2; // get instance status by finding the latest status bucket


        const latestTimestamp = (0, _lodash.chain)(statusBuckets).map(bucket => bucket.max_timestamp.value).max().value();
        const latestBucket = (0, _lodash.find)(statusBuckets, bucket => bucket.max_timestamp.value === latestTimestamp);
        status = latestBucket.key;
        requestsTotal = (_aggregations$request = aggregations.requests_total) === null || _aggregations$request === void 0 ? void 0 : _aggregations$request.value;
        connections = (_aggregations$concurr = aggregations.concurrent_connections) === null || _aggregations$concurr === void 0 ? void 0 : _aggregations$concurr.value;
        responseTime = (_aggregations$respons = aggregations.response_time_max) === null || _aggregations$respons === void 0 ? void 0 : _aggregations$respons.value;
        memorySize = (_aggregations$memory_ = aggregations.memory_rss) === null || _aggregations$memory_ === void 0 ? void 0 : _aggregations$memory_.value;
        memoryLimit = (_aggregations$memory_2 = aggregations.memory_heap_size_limit) === null || _aggregations$memory_2 === void 0 ? void 0 : _aggregations$memory_2.value;
      }

      return {
        clusterUuid,
        stats: {
          uuids: kibanaUuids.map(({
            key
          }) => key),
          status,
          requests_total: requestsTotal,
          concurrent_connections: connections,
          response_time_max: responseTime,
          memory_size: memorySize,
          memory_limit: memoryLimit,
          count: kibanaUuids.length
        }
      };
    });
  }));
}