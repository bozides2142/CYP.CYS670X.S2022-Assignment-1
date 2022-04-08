"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFieldValueFieldStatsRequest = exports.fetchFieldValueFieldStats = void 0;

var _get_query_with_params = require("../get_query_with_params");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getFieldValueFieldStatsRequest = (params, field) => {
  const query = (0, _get_query_with_params.getQueryWithParams)({
    params
  });
  const {
    index
  } = params;
  const size = 0;
  const aggs = {
    filtered_count: {
      filter: {
        term: {
          [`${field === null || field === void 0 ? void 0 : field.fieldName}`]: field === null || field === void 0 ? void 0 : field.fieldValue
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

exports.getFieldValueFieldStatsRequest = getFieldValueFieldStatsRequest;

const fetchFieldValueFieldStats = async (esClient, params, field) => {
  var _aggregations$filtere;

  const request = getFieldValueFieldStatsRequest(params, field);
  const {
    body
  } = await esClient.search(request);
  const aggregations = body.aggregations;
  const topValues = [{
    key: field.fieldValue,
    doc_count: aggregations.filtered_count.doc_count
  }];
  const stats = {
    fieldName: field.fieldName,
    topValues,
    topValuesSampleSize: (_aggregations$filtere = aggregations.filtered_count.doc_count) !== null && _aggregations$filtere !== void 0 ? _aggregations$filtere : 0
  };
  return stats;
};

exports.fetchFieldValueFieldStats = fetchFieldValueFieldStats;