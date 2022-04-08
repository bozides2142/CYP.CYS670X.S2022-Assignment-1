"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServiceNames = getServiceNames;

var _processor_event = require("../../../../common/processor_event");

var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");

var _all_option = require("../../../../common/agent_configuration/all_option");

var _transactions = require("../../../lib/helpers/transactions");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getServiceNames({
  setup,
  searchAggregatedTransactions,
  size
}) {
  var _resp$aggregations;

  const {
    apmEventClient
  } = setup;
  const params = {
    apm: {
      events: [(0, _transactions.getProcessorEventForTransactions)(searchAggregatedTransactions), _processor_event.ProcessorEvent.error, _processor_event.ProcessorEvent.metric]
    },
    body: {
      timeout: '1ms',
      size: 0,
      aggs: {
        services: {
          terms: {
            field: _elasticsearch_fieldnames.SERVICE_NAME,
            min_doc_count: 0,
            size
          }
        }
      }
    }
  };
  const resp = await apmEventClient.search('get_service_names_for_agent_config', params);
  const serviceNames = ((_resp$aggregations = resp.aggregations) === null || _resp$aggregations === void 0 ? void 0 : _resp$aggregations.services.buckets.map(bucket => bucket.key).sort()) || [];
  return [_all_option.ALL_OPTION_VALUE, ...serviceNames];
}