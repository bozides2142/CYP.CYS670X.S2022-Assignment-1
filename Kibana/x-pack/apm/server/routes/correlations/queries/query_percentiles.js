"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTransactionDurationPercentilesRequest = exports.fetchTransactionDurationPercentiles = void 0;

var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");

var _constants = require("../../../../common/correlations/constants");

var _get_query_with_params = require("./get_query_with_params");

var _get_request_base = require("./get_request_base");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getTransactionDurationPercentilesRequest = (params, percents, termFilters) => {
  const query = (0, _get_query_with_params.getQueryWithParams)({
    params,
    termFilters
  });
  return { ...(0, _get_request_base.getRequestBase)(params),
    body: {
      track_total_hits: true,
      query,
      size: 0,
      aggs: {
        transaction_duration_percentiles: {
          percentiles: {
            hdr: {
              number_of_significant_value_digits: _constants.SIGNIFICANT_VALUE_DIGITS
            },
            field: _elasticsearch_fieldnames.TRANSACTION_DURATION,
            ...(Array.isArray(percents) ? {
              percents
            } : {})
          }
        }
      }
    }
  };
};

exports.getTransactionDurationPercentilesRequest = getTransactionDurationPercentilesRequest;

const fetchTransactionDurationPercentiles = async (esClient, params, percents, termFilters) => {
  var _resp$body$aggregatio;

  const resp = await esClient.search(getTransactionDurationPercentilesRequest(params, percents, termFilters)); // return early with no results if the search didn't return any documents

  if (resp.body.hits.total.value === 0) {
    return {
      totalDocs: 0,
      percentiles: {}
    };
  }

  if (resp.body.aggregations === undefined) {
    throw new Error('fetchTransactionDurationPercentiles failed, did not return aggregations.');
  }

  return {
    totalDocs: resp.body.hits.total.value,
    percentiles: (_resp$body$aggregatio = resp.body.aggregations.transaction_duration_percentiles.values) !== null && _resp$body$aggregatio !== void 0 ? _resp$body$aggregatio : {}
  };
};

exports.fetchTransactionDurationPercentiles = fetchTransactionDurationPercentiles;