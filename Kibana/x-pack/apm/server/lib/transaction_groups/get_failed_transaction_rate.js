"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFailedTransactionRate = getFailedTransactionRate;

var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");

var _event_outcome = require("../../../common/event_outcome");

var _server = require("../../../../observability/server");

var _environment_query = require("../../../common/utils/environment_query");

var _transactions = require("../helpers/transactions");

var _get_bucket_size_for_aggregated_transactions = require("../helpers/get_bucket_size_for_aggregated_transactions");

var _transaction_error_rate = require("../helpers/transaction_error_rate");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getFailedTransactionRate({
  environment,
  kuery,
  serviceName,
  transactionType,
  transactionName,
  setup,
  searchAggregatedTransactions,
  start,
  end,
  numBuckets
}) {
  const {
    apmEventClient
  } = setup;
  const filter = [{
    term: {
      [_elasticsearch_fieldnames.SERVICE_NAME]: serviceName
    }
  }, {
    terms: {
      [_elasticsearch_fieldnames.EVENT_OUTCOME]: [_event_outcome.EventOutcome.failure, _event_outcome.EventOutcome.success]
    }
  }, ...(0, _server.termQuery)(_elasticsearch_fieldnames.TRANSACTION_NAME, transactionName), ...(0, _server.termQuery)(_elasticsearch_fieldnames.TRANSACTION_TYPE, transactionType), ...(0, _transactions.getDocumentTypeFilterForTransactions)(searchAggregatedTransactions), ...(0, _server.rangeQuery)(start, end), ...(0, _environment_query.environmentQuery)(environment), ...(0, _server.kqlQuery)(kuery)];
  const outcomes = (0, _transaction_error_rate.getOutcomeAggregation)();
  const params = {
    apm: {
      events: [(0, _transactions.getProcessorEventForTransactions)(searchAggregatedTransactions)]
    },
    body: {
      size: 0,
      query: {
        bool: {
          filter
        }
      },
      aggs: {
        outcomes,
        timeseries: {
          date_histogram: {
            field: '@timestamp',
            fixed_interval: (0, _get_bucket_size_for_aggregated_transactions.getBucketSizeForAggregatedTransactions)({
              start,
              end,
              searchAggregatedTransactions,
              numBuckets
            }).intervalString,
            min_doc_count: 0,
            extended_bounds: {
              min: start,
              max: end
            }
          },
          aggs: {
            outcomes
          }
        }
      }
    }
  };
  const resp = await apmEventClient.search('get_transaction_group_error_rate', params);

  if (!resp.aggregations) {
    return {
      timeseries: [],
      average: null
    };
  }

  const timeseries = (0, _transaction_error_rate.getFailedTransactionRateTimeSeries)(resp.aggregations.timeseries.buckets);
  const average = (0, _transaction_error_rate.calculateFailedTransactionRate)(resp.aggregations.outcomes);
  return {
    timeseries,
    average
  };
}