"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTermsAggRequest = exports.fetchTransactionDurationFieldValuePairs = void 0;

var _constants = require("../../../../common/correlations/constants");

var _utils = require("../utils");

var _get_query_with_params = require("./get_query_with_params");

var _get_request_base = require("./get_request_base");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getTermsAggRequest = (params, fieldName) => ({ ...(0, _get_request_base.getRequestBase)(params),
  body: {
    query: (0, _get_query_with_params.getQueryWithParams)({
      params
    }),
    size: 0,
    aggs: {
      attribute_terms: {
        terms: {
          field: fieldName,
          size: _constants.TERMS_SIZE
        }
      }
    }
  }
});

exports.getTermsAggRequest = getTermsAggRequest;

const fetchTransactionDurationFieldTerms = async (esClient, params, fieldName) => {
  var _resp$body$aggregatio;

  const resp = await esClient.search(getTermsAggRequest(params, fieldName));

  if (resp.body.aggregations === undefined) {
    throw new Error('fetchTransactionDurationFieldTerms failed, did not return aggregations.');
  }

  const buckets = (_resp$body$aggregatio = resp.body.aggregations.attribute_terms) === null || _resp$body$aggregatio === void 0 ? void 0 : _resp$body$aggregatio.buckets;

  if ((buckets === null || buckets === void 0 ? void 0 : buckets.length) >= 1) {
    return buckets.map(d => {
      var _d$key_as_string;

      return {
        fieldName,
        // The terms aggregation returns boolean fields as { key: 0, key_as_string: "false" },
        // so we need to pick `key_as_string` if it's present, otherwise searches on boolean fields would fail later on.
        fieldValue: (_d$key_as_string = d.key_as_string) !== null && _d$key_as_string !== void 0 ? _d$key_as_string : d.key
      };
    });
  }

  return [];
};

const fetchTransactionDurationFieldValuePairs = async (esClient, params, fieldCandidates) => {
  const {
    fulfilled: responses,
    rejected: errors
  } = (0, _utils.splitAllSettledPromises)(await Promise.allSettled(fieldCandidates.map(fieldCandidate => fetchTransactionDurationFieldTerms(esClient, params, fieldCandidate))));
  return {
    fieldValuePairs: responses.flat(),
    errors
  };
};

exports.fetchTransactionDurationFieldValuePairs = fetchTransactionDurationFieldValuePairs;