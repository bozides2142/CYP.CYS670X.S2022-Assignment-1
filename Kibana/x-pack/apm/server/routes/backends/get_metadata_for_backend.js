"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMetadataForBackend = getMetadataForBackend;

var _maybe2 = require("../../../common/utils/maybe");

var _processor_event = require("../../../common/processor_event");

var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");

var _server = require("../../../../observability/server");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getMetadataForBackend({
  setup,
  backendName,
  start,
  end
}) {
  var _maybe;

  const {
    apmEventClient
  } = setup;
  const sampleResponse = await apmEventClient.search('get_backend_sample', {
    apm: {
      events: [_processor_event.ProcessorEvent.span]
    },
    body: {
      size: 1,
      query: {
        bool: {
          filter: [{
            term: {
              [_elasticsearch_fieldnames.SPAN_DESTINATION_SERVICE_RESOURCE]: backendName
            }
          }, ...(0, _server.rangeQuery)(start, end)]
        }
      },
      sort: {
        '@timestamp': 'desc'
      }
    }
  });
  const sample = (_maybe = (0, _maybe2.maybe)(sampleResponse.hits.hits[0])) === null || _maybe === void 0 ? void 0 : _maybe._source;
  return {
    spanType: sample === null || sample === void 0 ? void 0 : sample.span.type,
    spanSubtype: sample === null || sample === void 0 ? void 0 : sample.span.subtype
  };
}