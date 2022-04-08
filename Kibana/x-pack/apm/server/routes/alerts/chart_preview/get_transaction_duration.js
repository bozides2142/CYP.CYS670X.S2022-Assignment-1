"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTransactionDurationChartPreview = getTransactionDurationChartPreview;

var _server = require("../../../../../observability/server");

var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");

var _environment_query = require("../../../../common/utils/environment_query");

var _transactions = require("../../../lib/helpers/transactions");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getTransactionDurationChartPreview({
  alertParams,
  setup
}) {
  const {
    apmEventClient
  } = setup;
  const {
    aggregationType,
    environment,
    serviceName,
    transactionType,
    interval,
    start,
    end
  } = alertParams;
  const searchAggregatedTransactions = await (0, _transactions.getSearchAggregatedTransactions)({ ...setup,
    kuery: ''
  });
  const query = {
    bool: {
      filter: [...(0, _server.termQuery)(_elasticsearch_fieldnames.SERVICE_NAME, serviceName), ...(0, _server.termQuery)(_elasticsearch_fieldnames.TRANSACTION_TYPE, transactionType), ...(0, _server.rangeQuery)(start, end), ...(0, _environment_query.environmentQuery)(environment), ...(0, _transactions.getDocumentTypeFilterForTransactions)(searchAggregatedTransactions)]
    }
  };
  const transactionDurationField = (0, _transactions.getDurationFieldForTransactions)(searchAggregatedTransactions);
  const aggs = {
    timeseries: {
      date_histogram: {
        field: '@timestamp',
        fixed_interval: interval,
        min_doc_count: 0,
        extended_bounds: {
          min: start,
          max: end
        }
      },
      aggs: {
        agg: aggregationType === 'avg' ? {
          avg: {
            field: transactionDurationField
          }
        } : {
          percentiles: {
            field: transactionDurationField,
            percents: [aggregationType === '95th' ? 95 : 99]
          }
        }
      }
    }
  };
  const params = {
    apm: {
      events: [(0, _transactions.getProcessorEventForTransactions)(searchAggregatedTransactions)]
    },
    body: {
      size: 0,
      query,
      aggs
    }
  };
  const resp = await apmEventClient.search('get_transaction_duration_chart_preview', params);

  if (!resp.aggregations) {
    return [];
  }

  return resp.aggregations.timeseries.buckets.map(bucket => {
    const percentilesKey = aggregationType === '95th' ? '95.0' : '99.0';
    const x = bucket.key;
    const y = aggregationType === 'avg' ? bucket.agg.value : bucket.agg.values[percentilesKey];
    return {
      x,
      y
    };
  });
}