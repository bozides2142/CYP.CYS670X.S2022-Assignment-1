"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runtimeMappingsSchema = exports.importFileQuerySchema = exports.importFileBodySchema = exports.analyzeFileQuerySchema = void 0;

var _configSchema = require("@kbn/config-schema");

var _i18n = require("@kbn/i18n");

var _runtime_field_utils = require("./utils/runtime_field_utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const analyzeFileQuerySchema = _configSchema.schema.object({
  charset: _configSchema.schema.maybe(_configSchema.schema.string()),
  column_names: _configSchema.schema.maybe(_configSchema.schema.string()),
  delimiter: _configSchema.schema.maybe(_configSchema.schema.string()),
  explain: _configSchema.schema.maybe(_configSchema.schema.string()),
  format: _configSchema.schema.maybe(_configSchema.schema.string()),
  grok_pattern: _configSchema.schema.maybe(_configSchema.schema.string()),
  has_header_row: _configSchema.schema.maybe(_configSchema.schema.string()),
  line_merge_size_limit: _configSchema.schema.maybe(_configSchema.schema.string()),
  lines_to_sample: _configSchema.schema.maybe(_configSchema.schema.string()),
  quote: _configSchema.schema.maybe(_configSchema.schema.string()),
  should_trim_fields: _configSchema.schema.maybe(_configSchema.schema.string()),
  timeout: _configSchema.schema.maybe(_configSchema.schema.string()),
  timestamp_field: _configSchema.schema.maybe(_configSchema.schema.string()),
  timestamp_format: _configSchema.schema.maybe(_configSchema.schema.string())
});

exports.analyzeFileQuerySchema = analyzeFileQuerySchema;

const importFileQuerySchema = _configSchema.schema.object({
  id: _configSchema.schema.maybe(_configSchema.schema.string())
});

exports.importFileQuerySchema = importFileQuerySchema;

const importFileBodySchema = _configSchema.schema.object({
  index: _configSchema.schema.string(),
  data: _configSchema.schema.arrayOf(_configSchema.schema.any()),
  settings: _configSchema.schema.maybe(_configSchema.schema.any()),

  /** Mappings */
  mappings: _configSchema.schema.any(),

  /** Ingest pipeline definition */
  ingestPipeline: _configSchema.schema.object({
    id: _configSchema.schema.maybe(_configSchema.schema.string()),
    pipeline: _configSchema.schema.maybe(_configSchema.schema.any())
  })
});

exports.importFileBodySchema = importFileBodySchema;

const runtimeMappingsSchema = _configSchema.schema.object({}, {
  unknowns: 'allow',
  validate: v => {
    if (Object.values(v).some(o => !(0, _runtime_field_utils.isRuntimeField)(o))) {
      return _i18n.i18n.translate('xpack.fileUpload.invalidRuntimeFieldMessage', {
        defaultMessage: 'Invalid runtime field'
      });
    }
  }
});

exports.runtimeMappingsSchema = runtimeMappingsSchema;