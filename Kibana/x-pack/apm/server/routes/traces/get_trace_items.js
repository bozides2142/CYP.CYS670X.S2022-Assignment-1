"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTraceItems = getTraceItems;

var _processor_event = require("../../../common/processor_event");

var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");

var _server = require("../../../../observability/server");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getTraceItems(traceId, setup, start, end) {
  const {
    apmEventClient,
    config
  } = setup;
  const maxTraceItems = config.ui.maxTraceItems;
  const excludedLogLevels = ['debug', 'info', 'warning'];
  const errorResponsePromise = apmEventClient.search('get_errors_docs', {
    apm: {
      events: [_processor_event.ProcessorEvent.error]
    },
    body: {
      size: maxTraceItems,
      query: {
        bool: {
          filter: [{
            term: {
              [_elasticsearch_fieldnames.TRACE_ID]: traceId
            }
          }, ...(0, _server.rangeQuery)(start, end)],
          must_not: {
            terms: {
              [_elasticsearch_fieldnames.ERROR_LOG_LEVEL]: excludedLogLevels
            }
          }
        }
      }
    }
  });
  const traceResponsePromise = apmEventClient.search('get_trace_docs', {
    apm: {
      events: [_processor_event.ProcessorEvent.span, _processor_event.ProcessorEvent.transaction]
    },
    body: {
      size: maxTraceItems,
      query: {
        bool: {
          filter: [{
            term: {
              [_elasticsearch_fieldnames.TRACE_ID]: traceId
            }
          }, ...(0, _server.rangeQuery)(start, end)],
          should: {
            exists: {
              field: _elasticsearch_fieldnames.PARENT_ID
            }
          }
        }
      },
      sort: [{
        _score: {
          order: 'asc'
        }
      }, {
        [_elasticsearch_fieldnames.TRANSACTION_DURATION]: {
          order: 'desc'
        }
      }, {
        [_elasticsearch_fieldnames.SPAN_DURATION]: {
          order: 'desc'
        }
      }],
      track_total_hits: true
    }
  });
  const errorResponse = await errorResponsePromise;
  const traceResponse = await traceResponsePromise;
  const exceedsMax = traceResponse.hits.total.value > maxTraceItems;
  const traceDocs = traceResponse.hits.hits.map(hit => hit._source);
  const errorDocs = errorResponse.hits.hits.map(hit => hit._source);
  return {
    exceedsMax,
    traceDocs,
    errorDocs
  };
}