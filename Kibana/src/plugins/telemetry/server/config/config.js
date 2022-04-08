"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.config = void 0;

var _configSchema = require("@kbn/config-schema");

var _utils = require("@kbn/utils");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const clusterEnvSchema = [_configSchema.schema.literal('prod'), _configSchema.schema.literal('staging')];

const configSchema = _configSchema.schema.object({
  enabled: _configSchema.schema.boolean({
    defaultValue: true
  }),
  allowChangingOptInStatus: _configSchema.schema.boolean({
    defaultValue: true
  }),
  optIn: _configSchema.schema.conditional(_configSchema.schema.siblingRef('allowChangingOptInStatus'), _configSchema.schema.literal(false), _configSchema.schema.maybe(_configSchema.schema.literal(true)), _configSchema.schema.boolean({
    defaultValue: true
  }), {
    defaultValue: true
  }),
  // `config` is used internally and not intended to be set
  config: _configSchema.schema.string({
    defaultValue: (0, _utils.getConfigPath)()
  }),
  banner: _configSchema.schema.boolean({
    defaultValue: true
  }),
  sendUsageTo: _configSchema.schema.conditional(_configSchema.schema.contextRef('dist'), _configSchema.schema.literal(false), // Point to staging if it's not a distributable release
  _configSchema.schema.oneOf(clusterEnvSchema, {
    defaultValue: 'staging'
  }), _configSchema.schema.oneOf(clusterEnvSchema, {
    defaultValue: 'prod'
  })),
  sendUsageFrom: _configSchema.schema.oneOf([_configSchema.schema.literal('server'), _configSchema.schema.literal('browser')], {
    defaultValue: 'server'
  })
});

const config = {
  schema: configSchema,
  exposeToBrowser: {
    enabled: true,
    banner: true,
    allowChangingOptInStatus: true,
    optIn: true,
    sendUsageFrom: true,
    sendUsageTo: true
  }
};
exports.config = config;