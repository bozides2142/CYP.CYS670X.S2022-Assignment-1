"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.metricsAggsSchemas = void 0;

var _configSchema = require("@kbn/config-schema");

var _common_schemas = require("./common_schemas");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Schemas for the metrics Aggregations
 *
 * Currently supported:
 * - avg
 * - cardinality
 * - min
 * - max
 * - sum
 * - top_hits
 * - weighted_avg
 *
 * Not implemented:
 * - boxplot
 * - extended_stats
 * - geo_bounds
 * - geo_centroid
 * - geo_line
 * - matrix_stats
 * - median_absolute_deviation
 * - percentile_ranks
 * - percentiles
 * - rate
 * - scripted_metric
 * - stats
 * - string_stats
 * - t_test
 * - value_count
 */
const metricsAggsSchemas = {
  avg: _configSchema.schema.object({
    field: _configSchema.schema.maybe(_configSchema.schema.string()),
    missing: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.string(), _configSchema.schema.number(), _configSchema.schema.boolean()]))
  }),
  cardinality: _configSchema.schema.object({
    field: _configSchema.schema.maybe(_configSchema.schema.string()),
    precision_threshold: _configSchema.schema.maybe(_configSchema.schema.number()),
    rehash: _configSchema.schema.maybe(_configSchema.schema.boolean()),
    missing: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.string(), _configSchema.schema.number(), _configSchema.schema.boolean()]))
  }),
  min: _configSchema.schema.object({
    field: _configSchema.schema.maybe(_configSchema.schema.string()),
    missing: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.string(), _configSchema.schema.number(), _configSchema.schema.boolean()])),
    format: _configSchema.schema.maybe(_configSchema.schema.string())
  }),
  max: _configSchema.schema.object({
    field: _configSchema.schema.maybe(_configSchema.schema.string()),
    missing: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.string(), _configSchema.schema.number(), _configSchema.schema.boolean()])),
    format: _configSchema.schema.maybe(_configSchema.schema.string())
  }),
  sum: _configSchema.schema.object({
    field: _configSchema.schema.maybe(_configSchema.schema.string()),
    missing: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.string(), _configSchema.schema.number(), _configSchema.schema.boolean()]))
  }),
  top_hits: _configSchema.schema.object({
    explain: _configSchema.schema.maybe(_configSchema.schema.boolean()),
    docvalue_fields: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.string(), _configSchema.schema.arrayOf(_configSchema.schema.string())])),
    stored_fields: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.string(), _configSchema.schema.arrayOf(_configSchema.schema.string())])),
    from: _configSchema.schema.maybe(_configSchema.schema.number()),
    size: _configSchema.schema.maybe(_configSchema.schema.number()),
    sort: _configSchema.schema.maybe(_common_schemas.sortSchema),
    seq_no_primary_term: _configSchema.schema.maybe(_configSchema.schema.boolean()),
    version: _configSchema.schema.maybe(_configSchema.schema.boolean()),
    track_scores: _configSchema.schema.maybe(_configSchema.schema.boolean()),
    highlight: _configSchema.schema.maybe(_configSchema.schema.any()),
    _source: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.boolean(), _configSchema.schema.string(), _configSchema.schema.arrayOf(_configSchema.schema.string())]))
  }),
  weighted_avg: _configSchema.schema.object({
    format: _configSchema.schema.maybe(_configSchema.schema.string()),
    value_type: _configSchema.schema.maybe(_configSchema.schema.string()),
    value: _configSchema.schema.maybe(_configSchema.schema.object({
      field: _configSchema.schema.maybe(_configSchema.schema.string()),
      missing: _configSchema.schema.maybe(_configSchema.schema.number())
    })),
    weight: _configSchema.schema.maybe(_configSchema.schema.object({
      field: _configSchema.schema.maybe(_configSchema.schema.string()),
      missing: _configSchema.schema.maybe(_configSchema.schema.number())
    }))
  })
};
exports.metricsAggsSchemas = metricsAggsSchemas;