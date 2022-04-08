"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LoggingService = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _logging_config = require("./logging_config");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/** @internal */
class LoggingService {
  constructor(coreContext) {
    (0, _defineProperty2.default)(this, "subscriptions", new Map());
    (0, _defineProperty2.default)(this, "log", void 0);
    (0, _defineProperty2.default)(this, "internalPreboot", void 0);
    this.log = coreContext.logger.get('logging');
  }

  preboot({
    loggingSystem
  }) {
    this.internalPreboot = {
      configure: (contextParts, config$) => {
        const contextName = _logging_config.LoggingConfig.getLoggerContext(contextParts);

        this.log.debug(`Setting custom config for context [${contextName}]`);
        const existingSubscription = this.subscriptions.get(contextName);

        if (existingSubscription) {
          existingSubscription.unsubscribe();
        } // Might be fancier way to do this with rxjs, but this works and is simple to understand


        this.subscriptions.set(contextName, config$.subscribe(config => {
          this.log.debug(`Updating logging config for context [${contextName}]`);
          loggingSystem.setContextConfig(contextParts, config);
        }));
      }
    };
    return this.internalPreboot;
  }

  setup() {
    return {
      configure: this.internalPreboot.configure
    };
  }

  start() {}

  stop() {
    for (const [, subscription] of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

}

exports.LoggingService = LoggingService;