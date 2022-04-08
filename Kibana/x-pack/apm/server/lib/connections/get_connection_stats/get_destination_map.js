"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDestinationMap = void 0;

var _objectHash = _interopRequireDefault(require("object-hash"));

var _get_offset_in_ms = require("../../../../common/utils/get_offset_in_ms");

var _environment_filter_values = require("../../../../common/environment_filter_values");

var _as_mutable_array = require("../../../../common/utils/as_mutable_array");

var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");

var _processor_event = require("../../../../common/processor_event");

var _server = require("../../../../../observability/server");

var _with_apm_span = require("../../../utils/with_apm_span");

var _connections = require("../../../../common/connections");

var _exclude_rum_exit_spans_query = require("../exclude_rum_exit_spans_query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// This operation tries to find a service for a backend, by:
// - getting a span for each value of span.destination.service.resource (which indicates an outgoing call)
// - for each span, find the transaction it creates
// - if there is a transaction, match the backend name (span.destination.service.resource) to a service


const getDestinationMap = ({
  setup,
  start,
  end,
  filter,
  offset
}) => {
  return (0, _with_apm_span.withApmSpan)('get_destination_map', async () => {
    var _response$aggregation;

    const {
      apmEventClient
    } = setup;
    const {
      startWithOffset,
      endWithOffset
    } = (0, _get_offset_in_ms.getOffsetInMs)({
      start,
      end,
      offset
    });
    const response = await apmEventClient.search('get_exit_span_samples', {
      apm: {
        events: [_processor_event.ProcessorEvent.span]
      },
      body: {
        size: 0,
        query: {
          bool: {
            filter: [{
              exists: {
                field: _elasticsearch_fieldnames.SPAN_DESTINATION_SERVICE_RESOURCE
              }
            }, ...(0, _server.rangeQuery)(startWithOffset, endWithOffset), ...filter, ...(0, _exclude_rum_exit_spans_query.excludeRumExitSpansQuery)()]
          }
        },
        aggs: {
          connections: {
            composite: {
              size: 10000,
              sources: (0, _as_mutable_array.asMutableArray)([{
                backendName: {
                  terms: {
                    field: _elasticsearch_fieldnames.SPAN_DESTINATION_SERVICE_RESOURCE
                  }
                }
              }, // make sure we get samples for both successful
              // and failed calls
              {
                eventOutcome: {
                  terms: {
                    field: _elasticsearch_fieldnames.EVENT_OUTCOME
                  }
                }
              }])
            },
            aggs: {
              sample: {
                top_metrics: {
                  size: 1,
                  metrics: (0, _as_mutable_array.asMutableArray)([{
                    field: _elasticsearch_fieldnames.SPAN_TYPE
                  }, {
                    field: _elasticsearch_fieldnames.SPAN_SUBTYPE
                  }, {
                    field: _elasticsearch_fieldnames.SPAN_ID
                  }]),
                  sort: [{
                    '@timestamp': 'asc'
                  }]
                }
              }
            }
          }
        }
      }
    });
    const destinationsBySpanId = new Map();
    (_response$aggregation = response.aggregations) === null || _response$aggregation === void 0 ? void 0 : _response$aggregation.connections.buckets.forEach(bucket => {
      const sample = bucket.sample.top[0].metrics;
      const spanId = sample[_elasticsearch_fieldnames.SPAN_ID];
      destinationsBySpanId.set(spanId, {
        backendName: bucket.key.backendName,
        spanId,
        spanType: sample[_elasticsearch_fieldnames.SPAN_TYPE] || '',
        spanSubtype: sample[_elasticsearch_fieldnames.SPAN_SUBTYPE] || ''
      });
    });
    const transactionResponse = await apmEventClient.search('get_transactions_for_exit_spans', {
      apm: {
        events: [_processor_event.ProcessorEvent.transaction]
      },
      body: {
        query: {
          bool: {
            filter: [{
              terms: {
                [_elasticsearch_fieldnames.PARENT_ID]: Array.from(destinationsBySpanId.keys())
              }
            }, // add a 5m buffer at the end of the time range for long running spans
            ...(0, _server.rangeQuery)(startWithOffset, endWithOffset + 1000 * 1000 * 60 * 5)]
          }
        },
        size: destinationsBySpanId.size,
        fields: (0, _as_mutable_array.asMutableArray)([_elasticsearch_fieldnames.SERVICE_NAME, _elasticsearch_fieldnames.SERVICE_ENVIRONMENT, _elasticsearch_fieldnames.AGENT_NAME, _elasticsearch_fieldnames.PARENT_ID]),
        _source: false
      }
    });
    transactionResponse.hits.hits.forEach(hit => {
      const spanId = String(hit.fields[_elasticsearch_fieldnames.PARENT_ID][0]);
      const destination = destinationsBySpanId.get(spanId);

      if (destination) {
        var _hit$fields$SERVICE_E, _hit$fields$SERVICE_E2;

        destinationsBySpanId.set(spanId, { ...destination,
          serviceName: String(hit.fields[_elasticsearch_fieldnames.SERVICE_NAME][0]),
          environment: String((_hit$fields$SERVICE_E = (_hit$fields$SERVICE_E2 = hit.fields[_elasticsearch_fieldnames.SERVICE_ENVIRONMENT]) === null || _hit$fields$SERVICE_E2 === void 0 ? void 0 : _hit$fields$SERVICE_E2[0]) !== null && _hit$fields$SERVICE_E !== void 0 ? _hit$fields$SERVICE_E : _environment_filter_values.ENVIRONMENT_NOT_DEFINED.value),
          agentName: hit.fields[_elasticsearch_fieldnames.AGENT_NAME][0]
        });
      }
    });
    const nodesByBackendName = new Map();
    destinationsBySpanId.forEach(destination => {
      var _nodesByBackendName$g;

      const existingDestination = (_nodesByBackendName$g = nodesByBackendName.get(destination.backendName)) !== null && _nodesByBackendName$g !== void 0 ? _nodesByBackendName$g : {};
      const mergedDestination = { ...existingDestination,
        ...destination
      };
      let node;

      if ('serviceName' in mergedDestination) {
        node = {
          serviceName: mergedDestination.serviceName,
          agentName: mergedDestination.agentName,
          environment: mergedDestination.environment,
          id: (0, _objectHash.default)({
            serviceName: mergedDestination.serviceName
          }),
          type: _connections.NodeType.service
        };
      } else {
        node = {
          backendName: mergedDestination.backendName,
          spanType: mergedDestination.spanType,
          spanSubtype: mergedDestination.spanSubtype,
          id: (0, _objectHash.default)({
            backendName: mergedDestination.backendName
          }),
          type: _connections.NodeType.backend
        };
      }

      nodesByBackendName.set(destination.backendName, node);
    });
    return nodesByBackendName;
  });
};

exports.getDestinationMap = getDestinationMap;