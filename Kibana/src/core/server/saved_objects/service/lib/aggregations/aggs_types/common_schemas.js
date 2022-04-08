"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sortSchema = exports.sortOrderSchema = void 0;

var _configSchema = require("@kbn/config-schema");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
// note: these schemas are not exhaustive. See the `Sort` type of `@elastic/elasticsearch` if you need to enhance it.
const fieldSchema = _configSchema.schema.string();

const sortOrderSchema = _configSchema.schema.oneOf([_configSchema.schema.literal('asc'), _configSchema.schema.literal('desc'), _configSchema.schema.literal('_doc')]);

exports.sortOrderSchema = sortOrderSchema;

const sortModeSchema = _configSchema.schema.oneOf([_configSchema.schema.literal('min'), _configSchema.schema.literal('max'), _configSchema.schema.literal('sum'), _configSchema.schema.literal('avg'), _configSchema.schema.literal('median')]);

const fieldSortSchema = _configSchema.schema.object({
  missing: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.string(), _configSchema.schema.number(), _configSchema.schema.boolean()])),
  mode: _configSchema.schema.maybe(sortModeSchema),
  order: _configSchema.schema.maybe(sortOrderSchema) // nested and unmapped_type not implemented yet

});

const sortContainerSchema = _configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.oneOf([sortOrderSchema, fieldSortSchema]));

const sortCombinationsSchema = _configSchema.schema.oneOf([fieldSchema, sortContainerSchema]);

const sortSchema = _configSchema.schema.oneOf([sortCombinationsSchema, _configSchema.schema.arrayOf(sortCombinationsSchema)]);

exports.sortSchema = sortSchema;