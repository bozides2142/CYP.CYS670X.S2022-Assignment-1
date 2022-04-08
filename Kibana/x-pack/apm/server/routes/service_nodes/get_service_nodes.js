"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServiceNodes = void 0;

var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");

var _service_nodes = require("../../../common/service_nodes");

var _as_mutable_array = require("../../../common/utils/as_mutable_array");

var _processor_event = require("../../../common/processor_event");

var _server = require("../../../../observability/server");

var _environment_query = require("../../../common/utils/environment_query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getServiceNodes = async ({
  kuery,
  setup,
  serviceName,
  environment,
  start,
  end
}) => {
  const {
    apmEventClient
  } = setup;
  const params = {
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
          }, ...(0, _server.rangeQuery)(start, end), ...(0, _environment_query.environmentQuery)(environment), ...(0, _server.kqlQuery)(kuery)]
        }
      },
      aggs: {
        nodes: {
          terms: {
            field: _elasticsearch_fieldnames.SERVICE_NODE_NAME,
            size: 10000,
            missing: _service_nodes.SERVICE_NODE_NAME_MISSING
          },
          aggs: {
            latest: {
              top_metrics: {
                metrics: (0, _as_mutable_array.asMutableArray)([{
                  field: _elasticsearch_fieldnames.HOST_NAME
                }]),
                sort: {
                  '@timestamp': 'desc'
                }
              }
            },
            cpu: {
              avg: {
                field: _elasticsearch_fieldnames.METRIC_PROCESS_CPU_PERCENT
              }
            },
            heapMemory: {
              avg: {
                field: _elasticsearch_fieldnames.METRIC_JAVA_HEAP_MEMORY_USED
              }
            },
            nonHeapMemory: {
              avg: {
                field: _elasticsearch_fieldnames.METRIC_JAVA_NON_HEAP_MEMORY_USED
              }
            },
            threadCount: {
              max: {
                field: _elasticsearch_fieldnames.METRIC_JAVA_THREAD_COUNT
              }
            }
          }
        }
      }
    }
  };
  const response = await apmEventClient.search('get_service_nodes', params);

  if (!response.aggregations) {
    return [];
  }

  return response.aggregations.nodes.buckets.map(bucket => {
    var _bucket$latest$top, _bucket$latest$top$, _bucket$latest$top$$m;

    return {
      name: bucket.key,
      cpu: bucket.cpu.value,
      heapMemory: bucket.heapMemory.value,
      hostName: (_bucket$latest$top = bucket.latest.top) === null || _bucket$latest$top === void 0 ? void 0 : (_bucket$latest$top$ = _bucket$latest$top[0]) === null || _bucket$latest$top$ === void 0 ? void 0 : (_bucket$latest$top$$m = _bucket$latest$top$.metrics) === null || _bucket$latest$top$$m === void 0 ? void 0 : _bucket$latest$top$$m[_elasticsearch_fieldnames.HOST_NAME],
      nonHeapMemory: bucket.nonHeapMemory.value,
      threadCount: bucket.threadCount.value
    };
  }).filter(item => item.cpu !== null || item.heapMemory !== null || item.nonHeapMemory !== null || item.threadCount != null);
};

exports.getServiceNodes = getServiceNodes;