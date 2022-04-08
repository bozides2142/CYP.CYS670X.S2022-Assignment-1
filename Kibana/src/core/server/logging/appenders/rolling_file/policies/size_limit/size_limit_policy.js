"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sizeLimitTriggeringPolicyConfigSchema = exports.SizeLimitTriggeringPolicy = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _configSchema = require("@kbn/config-schema");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const sizeLimitTriggeringPolicyConfigSchema = _configSchema.schema.object({
  type: _configSchema.schema.literal('size-limit'),
  size: _configSchema.schema.byteSize({
    min: '1b',
    defaultValue: '100mb'
  })
});
/**
 * A triggering policy based on a fixed size limit.
 *
 * Will trigger a rollover when the current log size exceed the
 * given {@link SizeLimitTriggeringPolicyConfig.size | size}.
 */


exports.sizeLimitTriggeringPolicyConfigSchema = sizeLimitTriggeringPolicyConfigSchema;

class SizeLimitTriggeringPolicy {
  constructor(config, context) {
    (0, _defineProperty2.default)(this, "maxFileSize", void 0);
    this.context = context;
    this.maxFileSize = config.size.getValueInBytes();
  }

  isTriggeringEvent(record) {
    return this.context.currentFileSize >= this.maxFileSize;
  }

}

exports.SizeLimitTriggeringPolicy = SizeLimitTriggeringPolicy;