"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bucketAggsSchemas = void 0;

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
 * Schemas for the Bucket aggregations.
 *
 * Currently supported:
 * - filter
 * - histogram
 * - nested
 * - reverse_nested
 * - terms
 *
 * Not implemented:
 * - adjacency_matrix
 * - auto_date_histogram
 * - children
 * - composite
 * - date_histogram
 * - date_range
 * - diversified_sampler
 * - filters
 * - geo_distance
 * - geohash_grid
 * - geotile_grid
 * - global
 * - ip_range
 * - missing
 * - multi_terms
 * - parent
 * - range
 * - rare_terms
 * - sampler
 * - significant_terms
 * - significant_text
 * - variable_width_histogram
 */
const bucketAggsSchemas = {
  filter: _configSchema.schema.object({
    term: _configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.oneOf([_configSchema.schema.string(), _configSchema.schema.boolean(), _configSchema.schema.number()]))
  }),
  histogram: _configSchema.schema.object({
    field: _configSchema.schema.maybe(_configSchema.schema.string()),
    interval: _configSchema.schema.maybe(_configSchema.schema.number()),
    min_doc_count: _configSchema.schema.maybe(_configSchema.schema.number({
      min: 1
    })),
    extended_bounds: _configSchema.schema.maybe(_configSchema.schema.object({
      min: _configSchema.schema.number(),
      max: _configSchema.schema.number()
    })),
    hard_bounds: _configSchema.schema.maybe(_configSchema.schema.object({
      min: _configSchema.schema.number(),
      max: _configSchema.schema.number()
    })),
    missing: _configSchema.schema.maybe(_configSchema.schema.number()),
    keyed: _configSchema.schema.maybe(_configSchema.schema.boolean()),
    order: _configSchema.schema.maybe(_configSchema.schema.object({
      _count: _configSchema.schema.string(),
      _key: _configSchema.schema.string()
    }))
  }),
  nested: _configSchema.schema.object({
    path: _configSchema.schema.string()
  }),
  reverse_nested: _configSchema.schema.object({
    path: _configSchema.schema.maybe(_configSchema.schema.string())
  }),
  terms: _configSchema.schema.object({
    field: _configSchema.schema.maybe(_configSchema.schema.string()),
    collect_mode: _configSchema.schema.maybe(_configSchema.schema.string()),
    exclude: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.string(), _configSchema.schema.arrayOf(_configSchema.schema.string())])),
    include: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.string(), _configSchema.schema.arrayOf(_configSchema.schema.string())])),
    execution_hint: _configSchema.schema.maybe(_configSchema.schema.string()),
    missing: _configSchema.schema.maybe(_configSchema.schema.number()),
    min_doc_count: _configSchema.schema.maybe(_configSchema.schema.number({
      min: 1
    })),
    size: _configSchema.schema.maybe(_configSchema.schema.number()),
    show_term_doc_count_error: _configSchema.schema.maybe(_configSchema.schema.boolean()),
    order: _configSchema.schema.maybe(_configSchema.schema.oneOf([_common_schemas.sortOrderSchema, _configSchema.schema.recordOf(_configSchema.schema.string(), _common_schemas.sortOrderSchema), _configSchema.schema.arrayOf(_configSchema.schema.recordOf(_configSchema.schema.string(), _common_schemas.sortOrderSchema))]))
  })
};
exports.bucketAggsSchemas = bucketAggsSchemas;