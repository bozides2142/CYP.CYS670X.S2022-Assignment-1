"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEnvironments = getEnvironments;

var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");

var _environment_filter_values = require("../../../common/environment_filter_values");

var _processor_event = require("../../../common/processor_event");

var _server = require("../../../../observability/server");

var _transactions = require("../../lib/helpers/transactions");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * This is used for getting the list of environments for the environments selector,
 * filtered by range.
 */


async function getEnvironments({
  searchAggregatedTransactions,
  serviceName,
  setup,
  size,
  start,
  end
}) {
  const operationName = serviceName ? 'get_environments_for_service' : 'get_environments';
  const {
    apmEventClient
  } = setup;
  const params = {
    apm: {
      events: [(0, _transactions.getProcessorEventForTransactions)(searchAggregatedTransactions), _processor_event.ProcessorEvent.metric, _processor_event.ProcessorEvent.error]
    },
    body: {
      size: 0,
      query: {
        bool: {
          filter: [...(0, _server.rangeQuery)(start, end), ...(0, _server.termQuery)(_elasticsearch_fieldnames.SERVICE_NAME, serviceName)]
        }
      },
      aggs: {
        environments: {
          terms: {
            field: _elasticsearch_fieldnames.SERVICE_ENVIRONMENT,
            missing: _environment_filter_values.ENVIRONMENT_NOT_DEFINED.value,
            size
          }
        }
      }
    }
  };
  const resp = await apmEventClient.search(operationName, params);
  const aggs = resp.aggregations;
  const environmentsBuckets = (aggs === null || aggs === void 0 ? void 0 : aggs.environments.buckets) || [];
  const environments = environmentsBuckets.map(environmentBucket => environmentBucket.key);
  return environments;
}