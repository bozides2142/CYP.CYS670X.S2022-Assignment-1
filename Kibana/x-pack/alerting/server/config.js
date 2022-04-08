"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configSchema = exports.DEFAULT_MAX_EPHEMERAL_ACTIONS_PER_ALERT = void 0;

var _configSchema = require("@kbn/config-schema");

var _lib = require("./lib");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const DEFAULT_MAX_EPHEMERAL_ACTIONS_PER_ALERT = 10;
exports.DEFAULT_MAX_EPHEMERAL_ACTIONS_PER_ALERT = DEFAULT_MAX_EPHEMERAL_ACTIONS_PER_ALERT;

const configSchema = _configSchema.schema.object({
  healthCheck: _configSchema.schema.object({
    interval: _configSchema.schema.string({
      validate: _lib.validateDurationSchema,
      defaultValue: '60m'
    })
  }),
  invalidateApiKeysTask: _configSchema.schema.object({
    interval: _configSchema.schema.string({
      validate: _lib.validateDurationSchema,
      defaultValue: '5m'
    }),
    removalDelay: _configSchema.schema.string({
      validate: _lib.validateDurationSchema,
      defaultValue: '1h'
    })
  }),
  maxEphemeralActionsPerAlert: _configSchema.schema.number({
    defaultValue: DEFAULT_MAX_EPHEMERAL_ACTIONS_PER_ALERT
  }),
  defaultRuleTaskTimeout: _configSchema.schema.string({
    validate: _lib.validateDurationSchema,
    defaultValue: '5m'
  }),
  cancelAlertsOnRuleTimeout: _configSchema.schema.boolean({
    defaultValue: true
  })
});

exports.configSchema = configSchema;