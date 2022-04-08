"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLatencyChartsForBackend = getLatencyChartsForBackend;

var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");

var _environment_query = require("../../../common/utils/environment_query");

var _server = require("../../../../observability/server");

var _processor_event = require("../../../common/processor_event");

var _metrics = require("../../lib/helpers/metrics");

var _get_offset_in_ms = require("../../../common/utils/get_offset_in_ms");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getLatencyChartsForBackend({
  backendName,
  setup,
  start,
  end,
  environment,
  kuery,
  offset
}) {
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
  const response = await apmEventClient.search('get_latency_for_backend', {
    apm: {
      events: [_processor_event.ProcessorEvent.metric]
    },
    body: {
      size: 0,
      query: {
        bool: {
          filter: [...(0, _environment_query.environmentQuery)(environment), ...(0, _server.kqlQuery)(kuery), ...(0, _server.rangeQuery)(startWithOffset, endWithOffset), {
            term: {
              [_elasticsearch_fieldnames.SPAN_DESTINATION_SERVICE_RESOURCE]: backendName
            }
          }]
        }
      },
      aggs: {
        timeseries: {
          date_histogram: (0, _metrics.getMetricsDateHistogramParams)({
            start: startWithOffset,
            end: endWithOffset,
            metricsInterval: 60
          }),
          aggs: {
            latency_sum: {
              sum: {
                field: _elasticsearch_fieldnames.SPAN_DESTINATION_SERVICE_RESPONSE_TIME_SUM
              }
            },
            latency_count: {
              sum: {
                field: _elasticsearch_fieldnames.SPAN_DESTINATION_SERVICE_RESPONSE_TIME_COUNT
              }
            }
          }
        }
      }
    }
  });
  return (_response$aggregation = (_response$aggregation2 = response.aggregations) === null || _response$aggregation2 === void 0 ? void 0 : _response$aggregation2.timeseries.buckets.map(bucket => {
    var _bucket$latency_sum$v, _bucket$latency_count;

    return {
      x: bucket.key + offsetInMs,
      y: ((_bucket$latency_sum$v = bucket.latency_sum.value) !== null && _bucket$latency_sum$v !== void 0 ? _bucket$latency_sum$v : 0) / ((_bucket$latency_count = bucket.latency_count.value) !== null && _bucket$latency_count !== void 0 ? _bucket$latency_count : 0)
    };
  })) !== null && _response$aggregation !== void 0 ? _response$aggregation : [];
}