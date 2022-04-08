"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getKeywordFieldStatsRequest = exports.fetchKeywordFieldStats = void 0;

var _get_query_with_params = require("../get_query_with_params");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getKeywordFieldStatsRequest = (params, fieldName, termFilters) => {
  const query = (0, _get_query_with_params.getQueryWithParams)({
    params,
    termFilters
  });
  const {
    index
  } = params;
  const size = 0;
  const aggs = {
    sampled_top: {
      terms: {
        field: fieldName,
        size: 10
      }
    }
  };
  const searchBody = {
    query,
    aggs
  };
  return {
    index,
    size,
    track_total_hits: false,
    body: searchBody
  };
};

exports.getKeywordFieldStatsRequest = getKeywordFieldStatsRequest;

const fetchKeywordFieldStats = async (esClient, params, field, termFilters) => {
  var _aggregations$sampled, _aggregations$sampled2, _aggregations$sampled3, _aggregations$sampled4;

  const request = getKeywordFieldStatsRequest(params, field.fieldName, termFilters);
  const {
    body
  } = await esClient.search(request);
  const aggregations = body.aggregations;
  const topValues = (_aggregations$sampled = aggregations === null || aggregations === void 0 ? void 0 : (_aggregations$sampled2 = aggregations.sampled_top) === null || _aggregations$sampled2 === void 0 ? void 0 : _aggregations$sampled2.buckets) !== null && _aggregations$sampled !== void 0 ? _aggregations$sampled : [];
  const stats = {
    fieldName: field.fieldName,
    topValues,
    topValuesSampleSize: topValues.reduce((acc, curr) => acc + curr.doc_count, (_aggregations$sampled3 = aggregations === null || aggregations === void 0 ? void 0 : (_aggregations$sampled4 = aggregations.sampled_top) === null || _aggregations$sampled4 === void 0 ? void 0 : _aggregations$sampled4.sum_other_doc_count) !== null && _aggregations$sampled3 !== void 0 ? _aggregations$sampled3 : 0)
  };
  return stats;
};

exports.fetchKeywordFieldStats = fetchKeywordFieldStats;