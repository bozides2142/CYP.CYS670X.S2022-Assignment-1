"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServiceInstancesSystemMetricStatistics = getServiceInstancesSystemMetricStatistics;

var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");

var _processor_event = require("../../../../common/processor_event");

var _service_nodes = require("../../../../common/service_nodes");

var _server = require("../../../../../observability/server");

var _environment_query = require("../../../../common/utils/environment_query");

var _get_bucket_size = require("../../../lib/helpers/get_bucket_size");

var _memory = require("../../metrics/by_agent/shared/memory");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getServiceInstancesSystemMetricStatistics({
  environment,
  kuery,
  setup,
  serviceName,
  size,
  start,
  end,
  serviceNodeIds,
  numBuckets,
  isComparisonSearch
}) {
  var _response$aggregation;

  const {
    apmEventClient
  } = setup;
  const {
    intervalString
  } = (0, _get_bucket_size.getBucketSize)({
    start,
    end,
    numBuckets
  });
  const systemMemoryFilter = {
    bool: {
      filter: [{
        exists: {
          field: _elasticsearch_fieldnames.METRIC_SYSTEM_FREE_MEMORY
        }
      }, {
        exists: {
          field: _elasticsearch_fieldnames.METRIC_SYSTEM_TOTAL_MEMORY
        }
      }]
    }
  };
  const cgroupMemoryFilter = {
    exists: {
      field: _elasticsearch_fieldnames.METRIC_CGROUP_MEMORY_USAGE_BYTES
    }
  };
  const cpuUsageFilter = {
    exists: {
      field: _elasticsearch_fieldnames.METRIC_PROCESS_CPU_PERCENT
    }
  };

  function withTimeseries(agg) {
    return { ...(isComparisonSearch ? {
        avg: {
          avg: agg
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
            avg: {
              avg: agg
            }
          }
        }
      } : {
        avg: {
          avg: agg
        }
      })
    };
  }

  const subAggs = {
    memory_usage_cgroup: {
      filter: cgroupMemoryFilter,
      aggs: withTimeseries({
        script: _memory.percentCgroupMemoryUsedScript
      })
    },
    memory_usage_system: {
      filter: systemMemoryFilter,
      aggs: withTimeseries({
        script: _memory.percentSystemMemoryUsedScript
      })
    },
    cpu_usage: {
      filter: cpuUsageFilter,
      aggs: withTimeseries({
        field: _elasticsearch_fieldnames.METRIC_PROCESS_CPU_PERCENT
      })
    }
  };
  const response = await apmEventClient.search('get_service_instances_system_metric_statistics', {
    apm: {
      events: [_processor_event.ProcessorEvent.metric]
    },
    body: {
      size: 0,
      query: {
        bool: {
          filter: [{
            term: {
              [_elasticsearch_fieldnames.SERVICE_NAME]: serviceName
            }
          }, ...(0, _server.rangeQuery)(start, end), ...(0, _environment_query.environmentQuery)(environment), ...(0, _server.kqlQuery)(kuery), ...(isComparisonSearch && serviceNodeIds ? [{
            terms: {
              [_elasticsearch_fieldnames.SERVICE_NODE_NAME]: serviceNodeIds
            }
          }] : [])],
          should: [cgroupMemoryFilter, systemMemoryFilter, cpuUsageFilter],
          minimum_should_match: 1
        }
      },
      aggs: {
        [_elasticsearch_fieldnames.SERVICE_NODE_NAME]: {
          terms: {
            field: _elasticsearch_fieldnames.SERVICE_NODE_NAME,
            missing: _service_nodes.SERVICE_NODE_NAME_MISSING,
            ...(size ? {
              size
            } : {}),
            ...(isComparisonSearch ? {
              include: serviceNodeIds
            } : {})
          },
          aggs: subAggs
        }
      }
    }
  });
  return ((_response$aggregation = response.aggregations) === null || _response$aggregation === void 0 ? void 0 : _response$aggregation[_elasticsearch_fieldnames.SERVICE_NODE_NAME].buckets.map(serviceNodeBucket => {
    const serviceNodeName = String(serviceNodeBucket.key);
    const hasCGroupData = serviceNodeBucket.memory_usage_cgroup.avg.value !== null;
    const memoryMetricsKey = hasCGroupData ? 'memory_usage_cgroup' : 'memory_usage_system';
    const cpuUsage = // Timeseries is available when isComparisonSearch is true
    'timeseries' in serviceNodeBucket.cpu_usage ? serviceNodeBucket.cpu_usage.timeseries.buckets.map(dateBucket => ({
      x: dateBucket.key,
      y: dateBucket.avg.value
    })) : serviceNodeBucket.cpu_usage.avg.value;
    const memoryUsageValue = serviceNodeBucket[memoryMetricsKey];
    const memoryUsage = // Timeseries is available when isComparisonSearch is true
    'timeseries' in memoryUsageValue ? memoryUsageValue.timeseries.buckets.map(dateBucket => ({
      x: dateBucket.key,
      y: dateBucket.avg.value
    })) : serviceNodeBucket[memoryMetricsKey].avg.value;
    return {
      serviceNodeName,
      cpuUsage,
      memoryUsage
    };
  })) || [];
}