"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTransactionDurationCorrelationRequest = exports.fetchTransactionDurationCorrelation = void 0;

var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");

var _get_query_with_params = require("./get_query_with_params");

var _get_request_base = require("./get_request_base");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getTransactionDurationCorrelationRequest = (params, expectations, ranges, fractions, totalDocCount, termFilters) => {
  const query = (0, _get_query_with_params.getQueryWithParams)({
    params,
    termFilters
  });
  const bucketCorrelation = {
    buckets_path: 'latency_ranges>_count',
    function: {
      count_correlation: {
        indicator: {
          fractions,
          expectations,
          doc_count: totalDocCount
        }
      }
    }
  };
  const body = {
    query,
    size: 0,
    aggs: {
      latency_ranges: {
        range: {
          field: _elasticsearch_fieldnames.TRANSACTION_DURATION,
          ranges
        }
      },
      // Pearson correlation value
      transaction_duration_correlation: {
        bucket_correlation: bucketCorrelation
      },
      // KS test p value = ks_test.less
      ks_test: {
        bucket_count_ks_test: {
          fractions,
          buckets_path: 'latency_ranges>_count',
          alternative: ['less', 'greater', 'two_sided']
        }
      }
    }
  };
  return { ...(0, _get_request_base.getRequestBase)(params),
    body
  };
};

exports.getTransactionDurationCorrelationRequest = getTransactionDurationCorrelationRequest;

const fetchTransactionDurationCorrelation = async (esClient, params, expectations, ranges, fractions, totalDocCount, termFilters) => {
  const resp = await esClient.search(getTransactionDurationCorrelationRequest(params, expectations, ranges, fractions, totalDocCount, termFilters));

  if (resp.body.aggregations === undefined) {
    throw new Error('fetchTransactionDurationCorrelation failed, did not return aggregations.');
  }

  const result = {
    ranges: resp.body.aggregations.latency_ranges.buckets,
    correlation: resp.body.aggregations.transaction_duration_correlation.value,
    ksTest: resp.body.aggregations.ks_test.less
  };
  return result;
};

exports.fetchTransactionDurationCorrelation = fetchTransactionDurationCorrelation;