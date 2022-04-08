"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getThroughputChartsForBackend = getThroughputChartsForBackend;

var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");

var _environment_query = require("../../../common/utils/environment_query");

var _server = require("../../../../observability/server");

var _processor_event = require("../../../common/processor_event");

var _get_offset_in_ms = require("../../../common/utils/get_offset_in_ms");

var _get_bucket_size = require("../../lib/helpers/get_bucket_size");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getThroughputChartsForBackend({
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
  const {
    intervalString
  } = (0, _get_bucket_size.getBucketSize)({
    start: startWithOffset,
    end: endWithOffset,
    minBucketSize: 60
  });
  const response = await apmEventClient.search('get_throughput_for_backend', {
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
          date_histogram: {
            field: '@timestamp',
            fixed_interval: intervalString,
            min_doc_count: 0,
            extended_bounds: {
              min: startWithOffset,
              max: endWithOffset
            }
          },
          aggs: {
            throughput: {
              rate: {
                field: _elasticsearch_fieldnames.SPAN_DESTINATION_SERVICE_RESPONSE_TIME_COUNT,
                unit: 'minute'
              }
            }
          }
        }
      }
    }
  });
  return (_response$aggregation = (_response$aggregation2 = response.aggregations) === null || _response$aggregation2 === void 0 ? void 0 : _response$aggregation2.timeseries.buckets.map(bucket => {
    return {
      x: bucket.key + offsetInMs,
      y: bucket.throughput.value
    };
  })) !== null && _response$aggregation !== void 0 ? _response$aggregation : [];
}