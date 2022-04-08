"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTransactionErrorRateChartPreview = getTransactionErrorRateChartPreview;

var _server = require("../../../../../observability/server");

var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");

var _environment_query = require("../../../../common/utils/environment_query");

var _transactions = require("../../../lib/helpers/transactions");

var _transaction_error_rate = require("../../../lib/helpers/transaction_error_rate");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getTransactionErrorRateChartPreview({
  setup,
  alertParams
}) {
  const {
    apmEventClient
  } = setup;
  const {
    serviceName,
    environment,
    transactionType,
    interval,
    start,
    end
  } = alertParams;
  const searchAggregatedTransactions = await (0, _transactions.getSearchAggregatedTransactions)({ ...setup,
    kuery: '',
    start,
    end
  });
  const outcomes = (0, _transaction_error_rate.getOutcomeAggregation)();
  const params = {
    apm: {
      events: [(0, _transactions.getProcessorEventForTransactions)(searchAggregatedTransactions)]
    },
    body: {
      size: 0,
      query: {
        bool: {
          filter: [...(0, _server.termQuery)(_elasticsearch_fieldnames.SERVICE_NAME, serviceName), ...(0, _server.termQuery)(_elasticsearch_fieldnames.TRANSACTION_TYPE, transactionType), ...(0, _server.rangeQuery)(start, end), ...(0, _environment_query.environmentQuery)(environment), ...(0, _transactions.getDocumentTypeFilterForTransactions)(searchAggregatedTransactions)]
        }
      },
      aggs: {
        outcomes,
        timeseries: {
          date_histogram: {
            field: '@timestamp',
            fixed_interval: interval,
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
  const resp = await apmEventClient.search('get_transaction_error_rate_chart_preview', params);

  if (!resp.aggregations) {
    return [];
  }

  return resp.aggregations.timeseries.buckets.map(bucket => {
    return {
      x: bucket.key,
      y: (0, _transaction_error_rate.calculateFailedTransactionRate)(bucket.outcomes)
    };
  });
}