"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEventMetadata = getEventMetadata;

var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");

var _processor_event = require("../../../common/processor_event");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getEventMetadata({
  apmEventClient,
  processorEvent,
  id
}) {
  const filter = [];

  switch (processorEvent) {
    case _processor_event.ProcessorEvent.error:
      filter.push({
        term: {
          [_elasticsearch_fieldnames.ERROR_ID]: id
        }
      });
      break;

    case _processor_event.ProcessorEvent.transaction:
      filter.push({
        term: {
          [_elasticsearch_fieldnames.TRANSACTION_ID]: id
        }
      });
      break;

    case _processor_event.ProcessorEvent.span:
      filter.push({
        term: {
          [_elasticsearch_fieldnames.SPAN_ID]: id
        }
      });
      break;
  }

  const response = await apmEventClient.search('get_event_metadata', {
    apm: {
      events: [processorEvent]
    },
    body: {
      query: {
        bool: {
          filter
        }
      },
      size: 1,
      _source: false,
      fields: [{
        field: '*',
        include_unmapped: true
      }]
    },
    terminate_after: 1
  });
  return response.hits.hits[0].fields;
}