"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DeprecationsRegistry = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _std = require("@kbn/std");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const MsInSec = 1000;

class DeprecationsRegistry {
  constructor({
    timeout = 10 * MsInSec
  } = {}) {
    (0, _defineProperty2.default)(this, "timeout", void 0);
    (0, _defineProperty2.default)(this, "deprecationContexts", []);
    (0, _defineProperty2.default)(this, "registerDeprecations", deprecationContext => {
      if (typeof deprecationContext.getDeprecations !== 'function') {
        throw new Error(`getDeprecations must be a function in registerDeprecations(context)`);
      }

      this.deprecationContexts.push(deprecationContext);
    });
    (0, _defineProperty2.default)(this, "getDeprecations", async dependencies => {
      return await Promise.allSettled(this.deprecationContexts.map(async deprecationContext => {
        const maybePromise = deprecationContext.getDeprecations(dependencies);

        if ((0, _std.isPromise)(maybePromise)) {
          const resultOrTimeout = await (0, _std.withTimeout)({
            promise: maybePromise,
            timeoutMs: this.timeout
          });

          if (resultOrTimeout.timedout) {
            throw new Error('Deprecations did not resolve in 10sec.');
          }

          return resultOrTimeout.value;
        } else {
          return maybePromise;
        }
      }));
    });
    this.timeout = timeout;
  }

}

exports.DeprecationsRegistry = DeprecationsRegistry;