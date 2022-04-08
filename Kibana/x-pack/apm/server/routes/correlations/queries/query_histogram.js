"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTransactionDurationHistogramRequest = exports.fetchTransactionDurationHistogram = void 0;

var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");

var _get_query_with_params = require("./get_query_with_params");

var _get_request_base = require("./get_request_base");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getTransactionDurationHistogramRequest = (params, interval, termFilters) => ({ ...(0, _get_request_base.getRequestBase)(params),
  body: {
    query: (0, _get_query_with_params.getQueryWithParams)({
      params,
      termFilters
    }),
    size: 0,
    aggs: {
      transaction_duration_histogram: {
        histogram: {
          field: _elasticsearch_fieldnames.TRANSACTION_DURATION,
          interval
        }
      }
    }
  }
});

exports.getTransactionDurationHistogramRequest = getTransactionDurationHistogramRequest;

const fetchTransactionDurationHistogram = async (esClient, params, interval, termFilters) => {
  var _resp$body$aggregatio;

  const resp = await esClient.search(getTransactionDurationHistogramRequest(params, interval, termFilters));

  if (resp.body.aggregations === undefined) {
    throw new Error('fetchTransactionDurationHistogram failed, did not return aggregations.');
  }

  return (_resp$body$aggregatio = resp.body.aggregations.transaction_duration_histogram.buckets) !== null && _resp$body$aggregatio !== void 0 ? _resp$body$aggregatio : [];
};

exports.fetchTransactionDurationHistogram = fetchTransactionDurationHistogram;