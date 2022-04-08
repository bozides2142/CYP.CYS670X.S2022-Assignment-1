"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStats = void 0;

var _lodash = require("lodash");

var _objectHash = _interopRequireDefault(require("object-hash"));

var _get_offset_in_ms = require("../../../../common/utils/get_offset_in_ms");

var _environment_filter_values = require("../../../../common/environment_filter_values");

var _as_mutable_array = require("../../../../common/utils/as_mutable_array");

var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");

var _processor_event = require("../../../../common/processor_event");

var _server = require("../../../../../observability/server");

var _get_bucket_size = require("../../helpers/get_bucket_size");

var _event_outcome = require("../../../../common/event_outcome");

var _connections = require("../../../../common/connections");

var _exclude_rum_exit_spans_query = require("../exclude_rum_exit_spans_query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getStats = async ({
  setup,
  start,
  end,
  filter,
  numBuckets,
  offset
}) => {
  var _response$aggregation, _response$aggregation2;

  const {
    apmEventClient
  } = setup;
  const {
    offsetInMs,
    startWithOffset,
    endWithOffset
  } = (0, _get_offset_in_ms.getOffsetInMs)({
    start,
    end,
    offset
  });
  const response = await apmEventClient.search('get_connection_stats', {
    apm: {
      events: [_processor_event.ProcessorEvent.metric]
    },
    body: {
      track_total_hits: true,
      size: 0,
      query: {
        bool: {
          filter: [...filter, {
            exists: {
              field: _elasticsearch_fieldnames.SPAN_DESTINATION_SERVICE_RESPONSE_TIME_COUNT
            }
          }, ...(0, _server.rangeQuery)(startWithOffset, endWithOffset), ...(0, _exclude_rum_exit_spans_query.excludeRumExitSpansQuery)()]
        }
      },
      aggs: {
        connections: {
          composite: {
            size: 10000,
            sources: (0, _as_mutable_array.asMutableArray)([{
              serviceName: {
                terms: {
                  field: _elasticsearch_fieldnames.SERVICE_NAME
                }
              }
            }, {
              backendName: {
                terms: {
                  field: _elasticsearch_fieldnames.SPAN_DESTINATION_SERVICE_RESOURCE
                }
              }
            }])
          },
          aggs: {
            sample: {
              top_metrics: {
                size: 1,
                metrics: (0, _as_mutable_array.asMutableArray)([{
                  field: _elasticsearch_fieldnames.SERVICE_ENVIRONMENT
                }, {
                  field: _elasticsearch_fieldnames.AGENT_NAME
                }, {
                  field: _elasticsearch_fieldnames.SPAN_TYPE
                }, {
                  field: _elasticsearch_fieldnames.SPAN_SUBTYPE
                }]),
                sort: {
                  '@timestamp': 'desc'
                }
              }
            },
            total_latency_sum: {
              sum: {
                field: _elasticsearch_fieldnames.SPAN_DESTINATION_SERVICE_RESPONSE_TIME_SUM
              }
            },
            total_latency_count: {
              sum: {
                field: _elasticsearch_fieldnames.SPAN_DESTINATION_SERVICE_RESPONSE_TIME_COUNT
              }
            },
            timeseries: {
              date_histogram: {
                field: '@timestamp',
                fixed_interval: (0, _get_bucket_size.getBucketSize)({
                  start: startWithOffset,
                  end: endWithOffset,
                  numBuckets,
                  minBucketSize: 60
                }).intervalString,
                extended_bounds: {
                  min: startWithOffset,
                  max: endWithOffset
                }
              },
              aggs: {
                latency_sum: {
                  sum: {
                    field: _elasticsearch_fieldnames.SPAN_DESTINATION_SERVICE_RESPONSE_TIME_SUM
                  }
                },
                count: {
                  sum: {
                    field: _elasticsearch_fieldnames.SPAN_DESTINATION_SERVICE_RESPONSE_TIME_COUNT
                  }
                },
                [_elasticsearch_fieldnames.EVENT_OUTCOME]: {
                  terms: {
                    field: _elasticsearch_fieldnames.EVENT_OUTCOME
                  },
                  aggs: {
                    count: {
                      sum: {
                        field: _elasticsearch_fieldnames.SPAN_DESTINATION_SERVICE_RESPONSE_TIME_COUNT
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
  });
  return (_response$aggregation = (_response$aggregation2 = response.aggregations) === null || _response$aggregation2 === void 0 ? void 0 : _response$aggregation2.connections.buckets.map(bucket => {
    const sample = bucket.sample.top[0].metrics;
    const serviceName = bucket.key.serviceName;
    const backendName = bucket.key.backendName;
    return {
      from: {
        id: (0, _objectHash.default)({
          serviceName
        }),
        serviceName,
        environment: sample[_elasticsearch_fieldnames.SERVICE_ENVIRONMENT] || _environment_filter_values.ENVIRONMENT_NOT_DEFINED.value,
        agentName: sample[_elasticsearch_fieldnames.AGENT_NAME],
        type: _connections.NodeType.service
      },
      to: {
        id: (0, _objectHash.default)({
          backendName
        }),
        backendName,
        spanType: sample[_elasticsearch_fieldnames.SPAN_TYPE],
        spanSubtype: sample[_elasticsearch_fieldnames.SPAN_SUBTYPE] || '',
        type: _connections.NodeType.backend
      },
      value: {
        count: (0, _lodash.sum)(bucket.timeseries.buckets.map(dateBucket => {
          var _dateBucket$count$val;

          return (_dateBucket$count$val = dateBucket.count.value) !== null && _dateBucket$count$val !== void 0 ? _dateBucket$count$val : 0;
        })),
        latency_sum: (0, _lodash.sum)(bucket.timeseries.buckets.map(dateBucket => {
          var _dateBucket$latency_s;

          return (_dateBucket$latency_s = dateBucket.latency_sum.value) !== null && _dateBucket$latency_s !== void 0 ? _dateBucket$latency_s : 0;
        })),
        error_count: (0, _lodash.sum)(bucket.timeseries.buckets.flatMap(dateBucket => {
          var _dateBucket$EVENT_OUT, _dateBucket$EVENT_OUT2;

          return (_dateBucket$EVENT_OUT = (_dateBucket$EVENT_OUT2 = dateBucket[_elasticsearch_fieldnames.EVENT_OUTCOME].buckets.find(outcomeBucket => outcomeBucket.key === _event_outcome.EventOutcome.failure)) === null || _dateBucket$EVENT_OUT2 === void 0 ? void 0 : _dateBucket$EVENT_OUT2.count.value) !== null && _dateBucket$EVENT_OUT !== void 0 ? _dateBucket$EVENT_OUT : 0;
        }))
      },
      timeseries: bucket.timeseries.buckets.map(dateBucket => {
        var _dateBucket$count$val2, _dateBucket$latency_s2, _dateBucket$EVENT_OUT3, _dateBucket$EVENT_OUT4;

        return {
          x: dateBucket.key + offsetInMs,
          count: (_dateBucket$count$val2 = dateBucket.count.value) !== null && _dateBucket$count$val2 !== void 0 ? _dateBucket$count$val2 : 0,
          latency_sum: (_dateBucket$latency_s2 = dateBucket.latency_sum.value) !== null && _dateBucket$latency_s2 !== void 0 ? _dateBucket$latency_s2 : 0,
          error_count: (_dateBucket$EVENT_OUT3 = (_dateBucket$EVENT_OUT4 = dateBucket[_elasticsearch_fieldnames.EVENT_OUTCOME].buckets.find(outcomeBucket => outcomeBucket.key === _event_outcome.EventOutcome.failure)) === null || _dateBucket$EVENT_OUT4 === void 0 ? void 0 : _dateBucket$EVENT_OUT4.count.value) !== null && _dateBucket$EVENT_OUT3 !== void 0 ? _dateBucket$EVENT_OUT3 : 0
        };
      })
    };
  })) !== null && _response$aggregation !== void 0 ? _response$aggregation : [];
};

exports.getStats = getStats;