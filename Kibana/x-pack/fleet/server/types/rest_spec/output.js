"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PutOutputRequestSchema = exports.PostOutputRequestSchema = exports.GetOutputsRequestSchema = exports.GetOneOutputRequestSchema = exports.DeleteOutputRequestSchema = void 0;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const GetOneOutputRequestSchema = {
  params: _configSchema.schema.object({
    outputId: _configSchema.schema.string()
  })
};
exports.GetOneOutputRequestSchema = GetOneOutputRequestSchema;
const DeleteOutputRequestSchema = {
  params: _configSchema.schema.object({
    outputId: _configSchema.schema.string()
  })
};
exports.DeleteOutputRequestSchema = DeleteOutputRequestSchema;
const GetOutputsRequestSchema = {};
exports.GetOutputsRequestSchema = GetOutputsRequestSchema;
const PostOutputRequestSchema = {
  body: _configSchema.schema.object({
    id: _configSchema.schema.maybe(_configSchema.schema.string()),
    name: _configSchema.schema.string(),
    type: _configSchema.schema.oneOf([_configSchema.schema.literal('elasticsearch')]),
    is_default: _configSchema.schema.boolean({
      defaultValue: false
    }),
    is_default_monitoring: _configSchema.schema.boolean({
      defaultValue: false
    }),
    hosts: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.uri({
      scheme: ['http', 'https']
    }))),
    ca_sha256: _configSchema.schema.maybe(_configSchema.schema.string()),
    ca_trusted_fingerprint: _configSchema.schema.maybe(_configSchema.schema.string()),
    config_yaml: _configSchema.schema.maybe(_configSchema.schema.string())
  })
};
exports.PostOutputRequestSchema = PostOutputRequestSchema;
const PutOutputRequestSchema = {
  params: _configSchema.schema.object({
    outputId: _configSchema.schema.string()
  }),
  body: _configSchema.schema.object({
    type: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.literal('elasticsearch')])),
    name: _configSchema.schema.maybe(_configSchema.schema.string()),
    is_default: _configSchema.schema.maybe(_configSchema.schema.boolean()),
    is_default_monitoring: _configSchema.schema.maybe(_configSchema.schema.boolean()),
    hosts: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.uri({
      scheme: ['http', 'https']
    }))),
    ca_sha256: _configSchema.schema.maybe(_configSchema.schema.string()),
    ca_trusted_fingerprint: _configSchema.schema.maybe(_configSchema.schema.string()),
    config_yaml: _configSchema.schema.maybe(_configSchema.schema.string())
  })
};
exports.PutOutputRequestSchema = PutOutputRequestSchema;