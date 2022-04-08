"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServiceMapServiceNodeInfo = getServiceMapServiceNodeInfo;

var _server = require("../../../../observability/server");

var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");

var _processor_event = require("../../../common/processor_event");

var _transaction_types = require("../../../common/transaction_types");

var _environment_query = require("../../../common/utils/environment_query");

var _get_offset_in_ms = require("../../../common/utils/get_offset_in_ms");

var _get_bucket_size_for_aggregated_transactions = require("../../lib/helpers/get_bucket_size_for_aggregated_transactions");

var _transactions = require("../../lib/helpers/transactions");

var _get_failed_transaction_rate = require("../../lib/transaction_groups/get_failed_transaction_rate");

var _with_apm_span = require("../../utils/with_apm_span");

var _memory = require("../metrics/by_agent/shared/memory");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getServiceMapServiceNodeInfo({
  environment,
  serviceName,
  setup,
  searchAggregatedTransactions,
  start,
  end,
  offset
}) {
  return (0, _with_apm_span.withApmSpan)('get_service_map_node_stats', async () => {
    const {
      offsetInMs,
      startWithOffset,
      endWithOffset
    } = (0, _get_offset_in_ms.getOffsetInMs)({
      start,
      end,
      offset
    });
    const filter = [{
      term: {
        [_elasticsearch_fieldnames.SERVICE_NAME]: serviceName
      }
    }, ...(0, _server.rangeQuery)(startWithOffset, endWithOffset), ...(0, _environment_query.environmentQuery)(environment)];
    const minutes = Math.abs((end - start) / (1000 * 60));
    const numBuckets = 20;
    const {
      intervalString,
      bucketSize
    } = (0, _get_bucket_size_for_aggregated_transactions.getBucketSizeForAggregatedTransactions)({
      start,
      end,
      searchAggregatedTransactions,
      numBuckets
    });
    const taskParams = {
      environment,
      filter,
      searchAggregatedTransactions,
      minutes,
      serviceName,
      setup,
      start: startWithOffset,
      end: endWithOffset,
      intervalString,
      bucketSize,
      numBuckets,
      offsetInMs
    };
    const [failedTransactionsRate, transactionStats, cpuUsage, memoryUsage] = await Promise.all([getFailedTransactionsRateStats(taskParams), getTransactionStats(taskParams), getCpuStats(taskParams), getMemoryStats(taskParams)]);
    return {
      failedTransactionsRate,
      transactionStats,
      cpuUsage,
      memoryUsage
    };
  });
}

async function getFailedTransactionsRateStats({
  setup,
  serviceName,
  environment,
  searchAggregatedTransactions,
  start,
  end,
  numBuckets,
  offsetInMs
}) {
  return (0, _with_apm_span.withApmSpan)('get_error_rate_for_service_map_node', async () => {
    const {
      average,
      timeseries
    } = await (0, _get_failed_transaction_rate.getFailedTransactionRate)({
      environment,
      setup,
      serviceName,
      searchAggregatedTransactions,
      start,
      end,
      kuery: '',
      numBuckets
    });
    return {
      value: average,
      timeseries: timeseries.map(({
        x,
        y
      }) => ({
        x: x + offsetInMs,
        y
      }))
    };
  });
}

async function getTransactionStats({
  setup,
  filter,
  minutes,
  searchAggregatedTransactions,
  start,
  end,
  intervalString,
  offsetInMs
}) {
  var _response$aggregation, _response$aggregation2, _response$aggregation3, _response$aggregation4;

  const {
    apmEventClient
  } = setup;
  const durationField = (0, _transactions.getDurationFieldForTransactions)(searchAggregatedTransactions);
  const params = {
    apm: {
      events: [(0, _transactions.getProcessorEventForTransactions)(searchAggregatedTransactions)]
    },
    body: {
      size: 0,
      query: {
        bool: {
          filter: [...filter, ...(0, _transactions.getDocumentTypeFilterForTransactions)(searchAggregatedTransactions), {
            terms: {
              [_elasticsearch_fieldnames.TRANSACTION_TYPE]: [_transaction_types.TRANSACTION_REQUEST, _transaction_types.TRANSACTION_PAGE_LOAD]
            }
          }]
        }
      },
      track_total_hits: true,
      aggs: {
        duration: {
          avg: {
            field: durationField
          }
        },
        timeseries: {
          date_histogram: {
            field: '@timestamp',
            fixed_interval: intervalString,
            min_doc_count: 0,
            extended_bounds: {
              min: start,
              max: end
            }
          },
          aggs: {
            latency: {
              avg: {
                field: durationField
              }
            }
          }
        }
      }
    }
  };
  const response = await apmEventClient.search('get_transaction_stats_for_service_map_node', params);
  const totalRequests = response.hits.total.value;
  return {
    latency: {
      value: (_response$aggregation = (_response$aggregation2 = response.aggregations) === null || _response$aggregation2 === void 0 ? void 0 : _response$aggregation2.duration.value) !== null && _response$aggregation !== void 0 ? _response$aggregation : null,
      timeseries: (_response$aggregation3 = response.aggregations) === null || _response$aggregation3 === void 0 ? void 0 : _response$aggregation3.timeseries.buckets.map(bucket => ({
        x: bucket.key + offsetInMs,
        y: bucket.latency.value
      }))
    },
    throughput: {
      value: totalRequests > 0 ? totalRequests / minutes : null,
      timeseries: (_response$aggregation4 = response.aggregations) === null || _response$aggregation4 === void 0 ? void 0 : _response$aggregation4.timeseries.buckets.map(bucket => {
        var _bucket$doc_count;

        return {
          x: bucket.key + offsetInMs,
          y: (_bucket$doc_count = bucket.doc_count) !== null && _bucket$doc_count !== void 0 ? _bucket$doc_count : 0
        };
      })
    }
  };
}

async function getCpuStats({
  setup,
  filter,
  intervalString,
  start,
  end,
  offsetInMs
}) {
  var _response$aggregation5, _response$aggregation6, _response$aggregation7;

  const {
    apmEventClient
  } = setup;
  const response = await apmEventClient.search('get_avg_cpu_usage_for_service_map_node', {
    apm: {
      events: [_processor_event.ProcessorEvent.metric]
    },
    body: {
      size: 0,
      query: {
        bool: {
          filter: [...filter, {
            exists: {
              field: _elasticsearch_fieldnames.METRIC_SYSTEM_CPU_PERCENT
            }
          }]
        }
      },
      aggs: {
        avgCpuUsage: {
          avg: {
            field: _elasticsearch_fieldnames.METRIC_SYSTEM_CPU_PERCENT
          }
        },
        timeseries: {
          date_histogram: {
            field: '@timestamp',
            fixed_interval: intervalString,
            min_doc_count: 0,
            extended_bounds: {
              min: start,
              max: end
            }
          },
          aggs: {
            cpuAvg: {
              avg: {
                field: _elasticsearch_fieldnames.METRIC_SYSTEM_CPU_PERCENT
              }
            }
          }
        }
      }
    }
  });
  return {
    value: (_response$aggregation5 = (_response$aggregation6 = response.aggregations) === null || _response$aggregation6 === void 0 ? void 0 : _response$aggregation6.avgCpuUsage.value) !== null && _response$aggregation5 !== void 0 ? _response$aggregation5 : null,
    timeseries: (_response$aggregation7 = response.aggregations) === null || _response$aggregation7 === void 0 ? void 0 : _response$aggregation7.timeseries.buckets.map(bucket => ({
      x: bucket.key + offsetInMs,
      y: bucket.cpuAvg.value
    }))
  };
}

function getMemoryStats({
  setup,
  filter,
  intervalString,
  start,
  end,
  offsetInMs
}) {
  return (0, _with_apm_span.withApmSpan)('get_memory_stats_for_service_map_node', async () => {
    const {
      apmEventClient
    } = setup;

    const getMemoryUsage = async ({
      additionalFilters,
      script
    }) => {
      var _response$aggregation8, _response$aggregation9, _response$aggregation10;

      const response = await apmEventClient.search('get_avg_memory_for_service_map_node', {
        apm: {
          events: [_processor_event.ProcessorEvent.metric]
        },
        body: {
          size: 0,
          query: {
            bool: {
              filter: [...filter, ...additionalFilters]
            }
          },
          aggs: {
            avgMemoryUsage: {
              avg: {
                script
              }
            },
            timeseries: {
              date_histogram: {
                field: '@timestamp',
                fixed_interval: intervalString,
                min_doc_count: 0,
                extended_bounds: {
                  min: start,
                  max: end
                }
              },
              aggs: {
                memoryAvg: {
                  avg: {
                    script
                  }
                }
              }
            }
          }
        }
      });
      return {
        value: (_response$aggregation8 = (_response$aggregation9 = response.aggregations) === null || _response$aggregation9 === void 0 ? void 0 : _response$aggregation9.avgMemoryUsage.value) !== null && _response$aggregation8 !== void 0 ? _response$aggregation8 : null,
        timeseries: (_response$aggregation10 = response.aggregations) === null || _response$aggregation10 === void 0 ? void 0 : _response$aggregation10.timeseries.buckets.map(bucket => ({
          x: bucket.key + offsetInMs,
          y: bucket.memoryAvg.value
        }))
      };
    };

    let memoryUsage = await getMemoryUsage({
      additionalFilters: [{
        exists: {
          field: _elasticsearch_fieldnames.METRIC_CGROUP_MEMORY_USAGE_BYTES
        }
      }],
      script: _memory.percentCgroupMemoryUsedScript
    });

    if (!memoryUsage) {
      memoryUsage = await getMemoryUsage({
        additionalFilters: [{
          exists: {
            field: _elasticsearch_fieldnames.METRIC_SYSTEM_FREE_MEMORY
          }
        }, {
          exists: {
            field: _elasticsearch_fieldnames.METRIC_SYSTEM_TOTAL_MEMORY
          }
        }],
        script: _memory.percentSystemMemoryUsedScript
      });
    }

    return memoryUsage;
  });
}