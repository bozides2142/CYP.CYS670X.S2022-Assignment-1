"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServiceMapBackendNodeInfo = getServiceMapBackendNodeInfo;

var _server = require("../../../../observability/server");

var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");

var _event_outcome = require("../../../common/event_outcome");

var _processor_event = require("../../../common/processor_event");

var _environment_query = require("../../../common/utils/environment_query");

var _with_apm_span = require("../../utils/with_apm_span");

var _calculate_throughput = require("../../lib/helpers/calculate_throughput");

var _get_bucket_size = require("../../lib/helpers/get_bucket_size");

var _transaction_error_rate = require("../../lib/helpers/transaction_error_rate");

var _get_offset_in_ms = require("../../../common/utils/get_offset_in_ms");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getServiceMapBackendNodeInfo({
  environment,
  backendName,
  setup,
  start,
  end,
  offset
}) {
  return (0, _with_apm_span.withApmSpan)('get_service_map_backend_node_stats', async () => {
    var _response$aggregation, _response$aggregation2, _response$aggregation3, _response$aggregation4, _response$aggregation5, _response$aggregation6, _response$aggregation7, _response$aggregation8, _response$aggregation9, _response$aggregation10;

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
    const {
      intervalString
    } = (0, _get_bucket_size.getBucketSize)({
      start: startWithOffset,
      end: endWithOffset,
      numBuckets: 20
    });
    const subAggs = {
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
      outcomes: {
        terms: {
          field: _elasticsearch_fieldnames.EVENT_OUTCOME,
          include: [_event_outcome.EventOutcome.failure]
        }
      }
    };
    const response = await apmEventClient.search('get_service_map_backend_node_stats', {
      apm: {
        events: [_processor_event.ProcessorEvent.metric]
      },
      body: {
        size: 0,
        query: {
          bool: {
            filter: [{
              term: {
                [_elasticsearch_fieldnames.SPAN_DESTINATION_SERVICE_RESOURCE]: backendName
              }
            }, ...(0, _server.rangeQuery)(startWithOffset, endWithOffset), ...(0, _environment_query.environmentQuery)(environment)]
          }
        },
        aggs: { ...subAggs,
          timeseries: {
            date_histogram: {
              field: '@timestamp',
              fixed_interval: intervalString,
              min_doc_count: 0,
              extended_bounds: {
                min: startWithOffset,
                max: endWithOffset
              }
            },
            aggs: subAggs
          }
        }
      }
    });
    const count = (_response$aggregation = (_response$aggregation2 = response.aggregations) === null || _response$aggregation2 === void 0 ? void 0 : _response$aggregation2.count.value) !== null && _response$aggregation !== void 0 ? _response$aggregation : 0;
    const failedTransactionsRateCount = (_response$aggregation3 = (_response$aggregation4 = response.aggregations) === null || _response$aggregation4 === void 0 ? void 0 : (_response$aggregation5 = _response$aggregation4.outcomes.buckets[0]) === null || _response$aggregation5 === void 0 ? void 0 : _response$aggregation5.doc_count) !== null && _response$aggregation3 !== void 0 ? _response$aggregation3 : 0;
    const latencySum = (_response$aggregation6 = (_response$aggregation7 = response.aggregations) === null || _response$aggregation7 === void 0 ? void 0 : _response$aggregation7.latency_sum.value) !== null && _response$aggregation6 !== void 0 ? _response$aggregation6 : 0;
    const avgFailedTransactionsRate = failedTransactionsRateCount / count;
    const latency = latencySum / count;
    const throughput = (0, _calculate_throughput.calculateThroughputWithRange)({
      start: startWithOffset,
      end: endWithOffset,
      value: count
    });

    if (count === 0) {
      return {
        failedTransactionsRate: undefined,
        transactionStats: {
          throughput: undefined,
          latency: undefined
        }
      };
    }

    return {
      failedTransactionsRate: {
        value: avgFailedTransactionsRate,
        timeseries: (_response$aggregation8 = response.aggregations) !== null && _response$aggregation8 !== void 0 && _response$aggregation8.timeseries ? (0, _transaction_error_rate.getFailedTransactionRateTimeSeries)(response.aggregations.timeseries.buckets).map(({
          x,
          y
        }) => ({
          x: x + offsetInMs,
          y
        })) : undefined
      },
      transactionStats: {
        throughput: {
          value: throughput,
          timeseries: (_response$aggregation9 = response.aggregations) === null || _response$aggregation9 === void 0 ? void 0 : _response$aggregation9.timeseries.buckets.map(bucket => {
            var _bucket$doc_count;

            return {
              x: bucket.key + offsetInMs,
              y: (0, _calculate_throughput.calculateThroughputWithRange)({
                start,
                end,
                value: (_bucket$doc_count = bucket.doc_count) !== null && _bucket$doc_count !== void 0 ? _bucket$doc_count : 0
              })
            };
          })
        },
        latency: {
          value: latency,
          timeseries: (_response$aggregation10 = response.aggregations) === null || _response$aggregation10 === void 0 ? void 0 : _response$aggregation10.timeseries.buckets.map(bucket => ({
            x: bucket.key + offsetInMs,
            y: bucket.latency_sum.value
          }))
        }
      }
    };
  });
}