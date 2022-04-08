"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getErrorRateChartsForBackend = getErrorRateChartsForBackend;

var _event_outcome = require("../../../common/event_outcome");

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


async function getErrorRateChartsForBackend({
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
  const response = await apmEventClient.search('get_error_rate_for_backend', {
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
          }, {
            terms: {
              [_elasticsearch_fieldnames.EVENT_OUTCOME]: [_event_outcome.EventOutcome.success, _event_outcome.EventOutcome.failure]
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
            failures: {
              filter: {
                term: {
                  [_elasticsearch_fieldnames.EVENT_OUTCOME]: _event_outcome.EventOutcome.failure
                }
              }
            }
          }
        }
      }
    }
  });
  return (_response$aggregation = (_response$aggregation2 = response.aggregations) === null || _response$aggregation2 === void 0 ? void 0 : _response$aggregation2.timeseries.buckets.map(bucket => {
    const totalCount = bucket.doc_count;
    const failureCount = bucket.failures.doc_count;
    return {
      x: bucket.key + offsetInMs,
      y: failureCount / totalCount
    };
  })) !== null && _response$aggregation !== void 0 ? _response$aggregation : [];
}