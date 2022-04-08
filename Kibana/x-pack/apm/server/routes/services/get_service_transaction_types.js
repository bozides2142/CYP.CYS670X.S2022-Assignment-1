"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServiceTransactionTypes = getServiceTransactionTypes;

var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");

var _server = require("../../../../observability/server");

var _transactions = require("../../lib/helpers/transactions");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getServiceTransactionTypes({
  setup,
  serviceName,
  searchAggregatedTransactions,
  start,
  end
}) {
  const {
    apmEventClient
  } = setup;
  const params = {
    apm: {
      events: [(0, _transactions.getProcessorEventForTransactions)(searchAggregatedTransactions)]
    },
    body: {
      size: 0,
      query: {
        bool: {
          filter: [...(0, _transactions.getDocumentTypeFilterForTransactions)(searchAggregatedTransactions), {
            term: {
              [_elasticsearch_fieldnames.SERVICE_NAME]: serviceName
            }
          }, ...(0, _server.rangeQuery)(start, end)]
        }
      },
      aggs: {
        types: {
          terms: {
            field: _elasticsearch_fieldnames.TRANSACTION_TYPE,
            size: 100
          }
        }
      }
    }
  };
  const {
    aggregations
  } = await apmEventClient.search('get_service_transaction_types', params);
  const transactionTypes = (aggregations === null || aggregations === void 0 ? void 0 : aggregations.types.buckets.map(bucket => bucket.key)) || [];
  return {
    transactionTypes
  };
}