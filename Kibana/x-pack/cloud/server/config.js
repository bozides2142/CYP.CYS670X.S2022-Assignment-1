"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.config = void 0;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const apmConfigSchema = _configSchema.schema.object({
  url: _configSchema.schema.maybe(_configSchema.schema.string()),
  secret_token: _configSchema.schema.maybe(_configSchema.schema.string()),
  ui: _configSchema.schema.maybe(_configSchema.schema.object({
    url: _configSchema.schema.maybe(_configSchema.schema.string())
  }))
});

const fullStoryConfigSchema = _configSchema.schema.object({
  enabled: _configSchema.schema.boolean({
    defaultValue: false
  }),
  org_id: _configSchema.schema.conditional(_configSchema.schema.siblingRef('enabled'), true, _configSchema.schema.string({
    minLength: 1
  }), _configSchema.schema.maybe(_configSchema.schema.string()))
});

const chatConfigSchema = _configSchema.schema.object({
  enabled: _configSchema.schema.boolean({
    defaultValue: false
  }),
  chatURL: _configSchema.schema.maybe(_configSchema.schema.string())
});

const configSchema = _configSchema.schema.object({
  apm: _configSchema.schema.maybe(apmConfigSchema),
  base_url: _configSchema.schema.maybe(_configSchema.schema.string()),
  chat: chatConfigSchema,
  chatIdentitySecret: _configSchema.schema.maybe(_configSchema.schema.string()),
  cname: _configSchema.schema.maybe(_configSchema.schema.string()),
  deployment_url: _configSchema.schema.maybe(_configSchema.schema.string()),
  full_story: fullStoryConfigSchema,
  id: _configSchema.schema.maybe(_configSchema.schema.string()),
  organization_url: _configSchema.schema.maybe(_configSchema.schema.string()),
  profile_url: _configSchema.schema.maybe(_configSchema.schema.string())
});

const config = {
  exposeToBrowser: {
    base_url: true,
    chat: true,
    cname: true,
    deployment_url: true,
    full_story: true,
    id: true,
    organization_url: true,
    profile_url: true
  },
  schema: configSchema
};
exports.config = config;