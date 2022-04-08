"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFailureCorrelationRequest = exports.fetchFailedTransactionsCorrelationPValues = void 0;

var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");

var _event_outcome = require("../../../../common/event_outcome");

var _query_ranges = require("./query_ranges");

var _get_query_with_params = require("./get_query_with_params");

var _get_request_base = require("./get_request_base");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getFailureCorrelationRequest = (params, fieldName) => {
  const query = (0, _get_query_with_params.getQueryWithParams)({
    params
  });
  const queryWithFailure = { ...query,
    bool: { ...query.bool,
      filter: [...query.bool.filter, ...[(0, _get_query_with_params.getTermsQuery)({
        fieldName: _elasticsearch_fieldnames.EVENT_OUTCOME,
        fieldValue: _event_outcome.EventOutcome.failure
      })]]
    }
  };
  const body = {
    query: queryWithFailure,
    size: 0,
    aggs: {
      failure_p_value: {
        significant_terms: {
          field: fieldName,
          background_filter: { // Important to have same query as above here
            // without it, we would be comparing sets of different filtered elements
            ...query
          },
          // No need to have must_not "event.outcome": "failure" clause
          // if background_is_superset is set to true
          p_value: {
            background_is_superset: true
          }
        }
      }
    }
  };
  return { ...(0, _get_request_base.getRequestBase)(params),
    body
  };
};

exports.getFailureCorrelationRequest = getFailureCorrelationRequest;

const fetchFailedTransactionsCorrelationPValues = async (esClient, params, histogramRangeSteps, fieldName) => {
  const resp = await esClient.search(getFailureCorrelationRequest(params, fieldName));

  if (resp.body.aggregations === undefined) {
    throw new Error('fetchErrorCorrelation failed, did not return aggregations.');
  }

  const overallResult = resp.body.aggregations.failure_p_value; // Using for of to sequentially augment the results with histogram data.

  const result = [];

  for (const bucket of overallResult.buckets) {
    // Scale the score into a value from 0 - 1
    // using a concave piecewise linear function in -log(p-value)
    const normalizedScore = 0.5 * Math.min(Math.max((bucket.score - 3.912) / 2.995, 0), 1) + 0.25 * Math.min(Math.max((bucket.score - 6.908) / 6.908, 0), 1) + 0.25 * Math.min(Math.max((bucket.score - 13.816) / 101.314, 0), 1);
    const histogram = await (0, _query_ranges.fetchTransactionDurationRanges)(esClient, params, histogramRangeSteps, [{
      fieldName,
      fieldValue: bucket.key
    }]);
    result.push({
      fieldName,
      fieldValue: bucket.key,
      doc_count: bucket.doc_count,
      bg_count: bucket.doc_count,
      score: bucket.score,
      pValue: Math.exp(-bucket.score),
      normalizedScore,
      // Percentage of time the term appears in failed transactions
      failurePercentage: bucket.doc_count / overallResult.doc_count,
      // Percentage of time the term appears in successful transactions
      successPercentage: (bucket.bg_count - bucket.doc_count) / (overallResult.bg_count - overallResult.doc_count),
      histogram
    });
  }

  return result;
};

exports.fetchFailedTransactionsCorrelationPValues = fetchFailedTransactionsCorrelationPValues;