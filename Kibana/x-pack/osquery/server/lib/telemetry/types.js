"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GetTrustedAppsRequestSchema = void 0;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// List HTTP Types


const GetTrustedAppsRequestSchema = {
  query: _configSchema.schema.object({
    page: _configSchema.schema.maybe(_configSchema.schema.number({
      defaultValue: 1,
      min: 1
    })),
    per_page: _configSchema.schema.maybe(_configSchema.schema.number({
      defaultValue: 20,
      min: 1
    })),
    kuery: _configSchema.schema.maybe(_configSchema.schema.string())
  })
};
exports.GetTrustedAppsRequestSchema = GetTrustedAppsRequestSchema;