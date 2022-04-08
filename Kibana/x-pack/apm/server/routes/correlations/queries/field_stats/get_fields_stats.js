"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchFieldsStats = void 0;

var _lodash = require("lodash");

var _fieldTypes = require("@kbn/field-types");

var _get_request_base = require("../get_request_base");

var _get_keyword_field_stats = require("./get_keyword_field_stats");

var _get_numeric_field_stats = require("./get_numeric_field_stats");

var _get_boolean_field_stats = require("./get_boolean_field_stats");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const fetchFieldsStats = async (esClient, fieldStatsParams, fieldsToSample, termFilters) => {
  const stats = [];
  const errors = [];
  if (fieldsToSample.length === 0) return {
    stats,
    errors
  };
  const respMapping = await esClient.fieldCaps({ ...(0, _get_request_base.getRequestBase)(fieldStatsParams),
    fields: fieldsToSample
  });
  const fieldStatsPromises = Object.entries(respMapping.body.fields).map(([key, value], idx) => {
    const field = {
      fieldName: key,
      fieldValue: ''
    };
    const fieldTypes = Object.keys(value);

    for (const ft of fieldTypes) {
      switch (ft) {
        case _fieldTypes.ES_FIELD_TYPES.KEYWORD:
        case _fieldTypes.ES_FIELD_TYPES.IP:
          return (0, _get_keyword_field_stats.fetchKeywordFieldStats)(esClient, fieldStatsParams, field, termFilters);
          break;

        case 'numeric':
        case 'number':
        case _fieldTypes.ES_FIELD_TYPES.FLOAT:
        case _fieldTypes.ES_FIELD_TYPES.HALF_FLOAT:
        case _fieldTypes.ES_FIELD_TYPES.SCALED_FLOAT:
        case _fieldTypes.ES_FIELD_TYPES.DOUBLE:
        case _fieldTypes.ES_FIELD_TYPES.INTEGER:
        case _fieldTypes.ES_FIELD_TYPES.LONG:
        case _fieldTypes.ES_FIELD_TYPES.SHORT:
        case _fieldTypes.ES_FIELD_TYPES.UNSIGNED_LONG:
        case _fieldTypes.ES_FIELD_TYPES.BYTE:
          return (0, _get_numeric_field_stats.fetchNumericFieldStats)(esClient, fieldStatsParams, field, termFilters);
          break;

        case _fieldTypes.ES_FIELD_TYPES.BOOLEAN:
          return (0, _get_boolean_field_stats.fetchBooleanFieldStats)(esClient, fieldStatsParams, field, termFilters);

        default:
          return;
      }
    }
  }).filter(f => f !== undefined);
  const batches = (0, _lodash.chunk)(fieldStatsPromises, 10);

  for (let i = 0; i < batches.length; i++) {
    try {
      const results = await Promise.allSettled(batches[i]);
      results.forEach(r => {
        if (r.status === 'fulfilled' && r.value !== undefined) {
          stats.push(r.value);
        }
      });
    } catch (e) {
      errors.push(e);
    }
  }

  return {
    stats,
    errors
  };
};

exports.fetchFieldsStats = fetchFieldsStats;