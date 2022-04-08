"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBooleanFieldStatsRequest = exports.fetchBooleanFieldStats = void 0;

var _get_query_with_params = require("../get_query_with_params");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getBooleanFieldStatsRequest = (params, fieldName, termFilters) => {
  const query = (0, _get_query_with_params.getQueryWithParams)({
    params,
    termFilters
  });
  const {
    index
  } = params;
  const size = 0;
  const aggs = {
    sampled_value_count: {
      filter: {
        exists: {
          field: fieldName
        }
      }
    },
    sampled_values: {
      terms: {
        field: fieldName,
        size: 2
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

exports.getBooleanFieldStatsRequest = getBooleanFieldStatsRequest;

const fetchBooleanFieldStats = async (esClient, params, field, termFilters) => {
  var _aggregations$sampled, _aggregations$sampled2, _aggregations$sampled3;

  const request = getBooleanFieldStatsRequest(params, field.fieldName, termFilters);
  const {
    body
  } = await esClient.search(request);
  const aggregations = body.aggregations;
  const stats = {
    fieldName: field.fieldName,
    count: (_aggregations$sampled = aggregations === null || aggregations === void 0 ? void 0 : aggregations.sampled_value_count.doc_count) !== null && _aggregations$sampled !== void 0 ? _aggregations$sampled : 0
  };
  const valueBuckets = (_aggregations$sampled2 = aggregations === null || aggregations === void 0 ? void 0 : (_aggregations$sampled3 = aggregations.sampled_values) === null || _aggregations$sampled3 === void 0 ? void 0 : _aggregations$sampled3.buckets) !== null && _aggregations$sampled2 !== void 0 ? _aggregations$sampled2 : [];
  valueBuckets.forEach(bucket => {
    stats[`${bucket.key.toString()}Count`] = bucket.doc_count;
  });
  return stats;
};

exports.fetchBooleanFieldStats = fetchBooleanFieldStats;