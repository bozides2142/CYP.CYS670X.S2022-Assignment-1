"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNumericFieldStatsRequest = exports.fetchNumericFieldStats = void 0;

var _get_query_with_params = require("../get_query_with_params");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getNumericFieldStatsRequest = (params, fieldName, termFilters) => {
  const query = (0, _get_query_with_params.getQueryWithParams)({
    params,
    termFilters
  });
  const size = 0;
  const {
    index
  } = params;
  const aggs = {
    sampled_field_stats: {
      filter: {
        exists: {
          field: fieldName
        }
      },
      aggs: {
        actual_stats: {
          stats: {
            field: fieldName
          }
        }
      }
    },
    sampled_top: {
      terms: {
        field: fieldName,
        size: 10,
        order: {
          _count: 'desc'
        }
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

exports.getNumericFieldStatsRequest = getNumericFieldStatsRequest;

const fetchNumericFieldStats = async (esClient, params, field, termFilters) => {
  var _aggregations$sampled, _aggregations$sampled2, _aggregations$sampled3, _aggregations$sampled4, _aggregations$sampled5, _aggregations$sampled6, _aggregations$sampled7, _aggregations$sampled8;

  const request = getNumericFieldStatsRequest(params, field.fieldName, termFilters);
  const {
    body
  } = await esClient.search(request);
  const aggregations = body.aggregations;
  const docCount = (_aggregations$sampled = aggregations === null || aggregations === void 0 ? void 0 : (_aggregations$sampled2 = aggregations.sampled_field_stats) === null || _aggregations$sampled2 === void 0 ? void 0 : _aggregations$sampled2.doc_count) !== null && _aggregations$sampled !== void 0 ? _aggregations$sampled : 0;
  const fieldStatsResp = (_aggregations$sampled3 = aggregations === null || aggregations === void 0 ? void 0 : (_aggregations$sampled4 = aggregations.sampled_field_stats) === null || _aggregations$sampled4 === void 0 ? void 0 : _aggregations$sampled4.actual_stats) !== null && _aggregations$sampled3 !== void 0 ? _aggregations$sampled3 : {};
  const topValues = (_aggregations$sampled5 = aggregations === null || aggregations === void 0 ? void 0 : (_aggregations$sampled6 = aggregations.sampled_top) === null || _aggregations$sampled6 === void 0 ? void 0 : _aggregations$sampled6.buckets) !== null && _aggregations$sampled5 !== void 0 ? _aggregations$sampled5 : [];
  const stats = {
    fieldName: field.fieldName,
    count: docCount,
    min: (fieldStatsResp === null || fieldStatsResp === void 0 ? void 0 : fieldStatsResp.min) || 0,
    max: (fieldStatsResp === null || fieldStatsResp === void 0 ? void 0 : fieldStatsResp.max) || 0,
    avg: (fieldStatsResp === null || fieldStatsResp === void 0 ? void 0 : fieldStatsResp.avg) || 0,
    topValues,
    topValuesSampleSize: topValues.reduce((acc, curr) => acc + curr.doc_count, (_aggregations$sampled7 = aggregations === null || aggregations === void 0 ? void 0 : (_aggregations$sampled8 = aggregations.sampled_top) === null || _aggregations$sampled8 === void 0 ? void 0 : _aggregations$sampled8.sum_other_doc_count) !== null && _aggregations$sampled7 !== void 0 ? _aggregations$sampled7 : 0)
  };
  return stats;
};

exports.fetchNumericFieldStats = fetchNumericFieldStats;