"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getErrorGroupMainStatistics = getErrorGroupMainStatistics;

var _server = require("../../../../../observability/server");

var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");

var _processor_event = require("../../../../common/processor_event");

var _environment_query = require("../../../../common/utils/environment_query");

var _get_error_name = require("../../../lib/helpers/get_error_name");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getErrorGroupMainStatistics({
  kuery,
  serviceName,
  setup,
  environment,
  sortField,
  sortDirection = 'desc',
  start,
  end
}) {
  var _response$aggregation, _response$aggregation2;

  const {
    apmEventClient
  } = setup; // sort buckets by last occurrence of error

  const sortByLatestOccurrence = sortField === 'lastSeen';
  const maxTimestampAggKey = 'max_timestamp';
  const order = sortByLatestOccurrence ? {
    [maxTimestampAggKey]: sortDirection
  } : {
    _count: sortDirection
  };
  const response = await apmEventClient.search('get_error_group_main_statistics', {
    apm: {
      events: [_processor_event.ProcessorEvent.error]
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
        error_groups: {
          terms: {
            field: _elasticsearch_fieldnames.ERROR_GROUP_ID,
            size: 500,
            order
          },
          aggs: {
            sample: {
              top_hits: {
                size: 1,
                _source: [_elasticsearch_fieldnames.ERROR_LOG_MESSAGE, _elasticsearch_fieldnames.ERROR_EXC_MESSAGE, _elasticsearch_fieldnames.ERROR_EXC_HANDLED, _elasticsearch_fieldnames.ERROR_EXC_TYPE, _elasticsearch_fieldnames.ERROR_CULPRIT, _elasticsearch_fieldnames.ERROR_GROUP_ID, '@timestamp'],
                sort: {
                  '@timestamp': 'desc'
                }
              }
            },
            ...(sortByLatestOccurrence ? {
              [maxTimestampAggKey]: {
                max: {
                  field: '@timestamp'
                }
              }
            } : {})
          }
        }
      }
    }
  });
  return (_response$aggregation = (_response$aggregation2 = response.aggregations) === null || _response$aggregation2 === void 0 ? void 0 : _response$aggregation2.error_groups.buckets.map(bucket => {
    var _bucket$sample$hits$h, _bucket$sample$hits$h2, _bucket$sample$hits$h3, _bucket$sample$hits$h4, _bucket$sample$hits$h5, _bucket$sample$hits$h6;

    return {
      groupId: bucket.key,
      name: (0, _get_error_name.getErrorName)(bucket.sample.hits.hits[0]._source),
      lastSeen: new Date((_bucket$sample$hits$h = bucket.sample.hits.hits[0]) === null || _bucket$sample$hits$h === void 0 ? void 0 : _bucket$sample$hits$h._source['@timestamp']).getTime(),
      occurrences: bucket.doc_count,
      culprit: (_bucket$sample$hits$h2 = bucket.sample.hits.hits[0]) === null || _bucket$sample$hits$h2 === void 0 ? void 0 : _bucket$sample$hits$h2._source.error.culprit,
      handled: (_bucket$sample$hits$h3 = bucket.sample.hits.hits[0]) === null || _bucket$sample$hits$h3 === void 0 ? void 0 : (_bucket$sample$hits$h4 = _bucket$sample$hits$h3._source.error.exception) === null || _bucket$sample$hits$h4 === void 0 ? void 0 : _bucket$sample$hits$h4[0].handled,
      type: (_bucket$sample$hits$h5 = bucket.sample.hits.hits[0]) === null || _bucket$sample$hits$h5 === void 0 ? void 0 : (_bucket$sample$hits$h6 = _bucket$sample$hits$h5._source.error.exception) === null || _bucket$sample$hits$h6 === void 0 ? void 0 : _bucket$sample$hits$h6[0].type
    };
  })) !== null && _response$aggregation !== void 0 ? _response$aggregation : [];
}