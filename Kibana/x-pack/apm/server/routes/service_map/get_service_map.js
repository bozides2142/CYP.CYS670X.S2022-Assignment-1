"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServiceMap = getServiceMap;

var _lodash = require("lodash");

var _processor_event = require("../../../common/processor_event");

var _server = require("../../../../observability/server");

var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");

var _environment_query = require("../../../common/utils/environment_query");

var _with_apm_span = require("../../utils/with_apm_span");

var _get_service_anomalies = require("./get_service_anomalies");

var _get_service_map_from_trace_ids = require("./get_service_map_from_trace_ids");

var _get_trace_sample_ids = require("./get_trace_sample_ids");

var _transform_service_map_responses = require("./transform_service_map_responses");

var _environment_filter_values = require("../../../common/environment_filter_values");

var _transactions = require("../../lib/helpers/transactions");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getConnectionData({
  setup,
  serviceName,
  environment,
  start,
  end
}) {
  return (0, _with_apm_span.withApmSpan)('get_service_map_connections', async () => {
    const {
      traceIds
    } = await (0, _get_trace_sample_ids.getTraceSampleIds)({
      setup,
      serviceName,
      environment,
      start,
      end
    });
    const chunks = (0, _lodash.chunk)(traceIds, setup.config.serviceMapMaxTracesPerRequest);
    const init = {
      connections: [],
      discoveredServices: []
    };

    if (!traceIds.length) {
      return init;
    }

    const chunkedResponses = await (0, _with_apm_span.withApmSpan)('get_service_paths_from_all_trace_ids', () => Promise.all(chunks.map(traceIdsChunk => (0, _get_service_map_from_trace_ids.getServiceMapFromTraceIds)({
      setup,
      traceIds: traceIdsChunk,
      start,
      end
    }))));
    return chunkedResponses.reduce((prev, current) => {
      return {
        connections: prev.connections.concat(current.connections),
        discoveredServices: prev.discoveredServices.concat(current.discoveredServices)
      };
    });
  });
}

async function getServicesData(options) {
  var _response$aggregation;

  const {
    environment,
    setup,
    searchAggregatedTransactions,
    start,
    end
  } = options;
  const params = {
    apm: {
      events: [(0, _transactions.getProcessorEventForTransactions)(searchAggregatedTransactions), _processor_event.ProcessorEvent.metric, _processor_event.ProcessorEvent.error]
    },
    body: {
      size: 0,
      query: {
        bool: {
          filter: [...(0, _server.rangeQuery)(start, end), ...(0, _environment_query.environmentQuery)(environment), ...(0, _server.termQuery)(_elasticsearch_fieldnames.SERVICE_NAME, options.serviceName)]
        }
      },
      aggs: {
        services: {
          terms: {
            field: _elasticsearch_fieldnames.SERVICE_NAME,
            size: 500
          },
          aggs: {
            agent_name: {
              terms: {
                field: _elasticsearch_fieldnames.AGENT_NAME
              }
            }
          }
        }
      }
    }
  };
  const {
    apmEventClient
  } = setup;
  const response = await apmEventClient.search('get_service_stats_for_service_map', params);
  return ((_response$aggregation = response.aggregations) === null || _response$aggregation === void 0 ? void 0 : _response$aggregation.services.buckets.map(bucket => {
    var _bucket$agent_name$bu;

    return {
      [_elasticsearch_fieldnames.SERVICE_NAME]: bucket.key,
      [_elasticsearch_fieldnames.AGENT_NAME]: ((_bucket$agent_name$bu = bucket.agent_name.buckets[0]) === null || _bucket$agent_name$bu === void 0 ? void 0 : _bucket$agent_name$bu.key) || '',
      [_elasticsearch_fieldnames.SERVICE_ENVIRONMENT]: options.environment === _environment_filter_values.ENVIRONMENT_ALL.value ? null : options.environment
    };
  })) || [];
}

function getServiceMap(options) {
  return (0, _with_apm_span.withApmSpan)('get_service_map', async () => {
    const {
      logger
    } = options;
    const anomaliesPromise = (0, _get_service_anomalies.getServiceAnomalies)(options // always catch error to avoid breaking service maps if there is a problem with ML
    ).catch(error => {
      logger.warn(`Unable to retrieve anomalies for service maps.`);
      logger.error(error);
      return _get_service_anomalies.DEFAULT_ANOMALIES;
    });
    const [connectionData, servicesData, anomalies] = await Promise.all([getConnectionData(options), getServicesData(options), anomaliesPromise]);
    return (0, _transform_service_map_responses.transformServiceMapResponses)({ ...connectionData,
      services: servicesData,
      anomalies
    });
  });
}