"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConfigSchema = void 0;

var _configSchema = require("@kbn/config-schema");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const ConfigSchema = _configSchema.schema.object({
  enabled: _configSchema.schema.boolean({
    defaultValue: true
  }),
  connectionCheck: _configSchema.schema.object({
    interval: _configSchema.schema.duration({
      defaultValue: '5s',

      validate(value) {
        if (value.asSeconds() < 1) {
          return 'the value must be greater or equal to 1 second.';
        }
      }

    })
  })
});

exports.ConfigSchema = ConfigSchema;