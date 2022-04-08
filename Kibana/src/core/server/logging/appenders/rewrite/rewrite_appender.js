"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RewriteAppender = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _configSchema = require("@kbn/config-schema");

var _policies = require("./policies");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Appender that can modify the `LogRecord` instances it receives before passing
 * them along to another {@link Appender}.
 * @internal
 */
class RewriteAppender {
  constructor(config) {
    (0, _defineProperty2.default)(this, "appenders", new Map());
    (0, _defineProperty2.default)(this, "policy", void 0);
    this.config = config;
    this.policy = (0, _policies.createRewritePolicy)(config.policy);
  }
  /**
   * List of appenders that are dependencies of this appender.
   *
   * `addAppender` will throw an error when called with an appender
   * reference that isn't in this list.
   */


  get appenderRefs() {
    return this.config.appenders;
  }
  /**
   * Appenders can be "attached" to this one so that the RewriteAppender
   * is able to act as a sort of middleware by calling `append` on other appenders.
   *
   * As appenders cannot be attached to each other until they are created,
   * the `addAppender` method is used to pass in a configured appender.
   */


  addAppender(appenderRef, appender) {
    if (!this.appenderRefs.includes(appenderRef)) {
      throw new Error(`addAppender was called with an appender key that is missing from the appenderRefs: "${appenderRef}".`);
    }

    this.appenders.set(appenderRef, appender);
  }
  /**
   * Modifies the `record` and passes it to the specified appender.
   */


  append(record) {
    const rewrittenRecord = this.policy.rewrite(record);

    for (const appenderRef of this.appenderRefs) {
      const appender = this.appenders.get(appenderRef);

      if (!appender) {
        throw new Error(`Rewrite Appender could not find appender key "${appenderRef}". ` + 'Be sure `appender.addAppender()` was called before `appender.append()`.');
      }

      appender.append(rewrittenRecord);
    }
  }
  /**
   * Disposes `RewriteAppender`.
   */


  dispose() {
    this.appenders.clear();
  }

}

exports.RewriteAppender = RewriteAppender;
(0, _defineProperty2.default)(RewriteAppender, "configSchema", _configSchema.schema.object({
  type: _configSchema.schema.literal('rewrite'),
  appenders: _configSchema.schema.arrayOf(_configSchema.schema.string(), {
    defaultValue: []
  }),
  policy: _policies.rewritePolicyConfigSchema
}));