"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServiceCount = getServiceCount;

var _processor_event = require("../../../common/processor_event");

var _server = require("../../../../observability/server");

var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");

var _transactions = require("../../lib/helpers/transactions");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getServiceCount({
  setup,
  searchAggregatedTransactions,
  start,
  end
}) {
  const {
    apmEventClient
  } = setup;
  const params = {
    apm: {
      events: [(0, _transactions.getProcessorEventForTransactions)(searchAggregatedTransactions), _processor_event.ProcessorEvent.error, _processor_event.ProcessorEvent.metric]
    },
    body: {
      size: 0,
      query: {
        bool: {
          filter: (0, _server.rangeQuery)(start, end)
        }
      },
      aggs: {
        serviceCount: {
          cardinality: {
            field: _elasticsearch_fieldnames.SERVICE_NAME
          }
        }
      }
    }
  };
  const {
    aggregations
  } = await apmEventClient.search('observability_overview_get_service_count', params);
  return (aggregations === null || aggregations === void 0 ? void 0 : aggregations.serviceCount.value) || 0;
}