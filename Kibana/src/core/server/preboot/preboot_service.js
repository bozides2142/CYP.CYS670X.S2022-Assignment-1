"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PrebootService = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/** @internal */
class PrebootService {
  constructor(core) {
    (0, _defineProperty2.default)(this, "promiseList", []);
    (0, _defineProperty2.default)(this, "waitUntilCanSetupPromise", void 0);
    (0, _defineProperty2.default)(this, "isSetupOnHold", false);
    (0, _defineProperty2.default)(this, "log", void 0);
    this.core = core;
    this.log = this.core.logger.get('preboot');
  }

  preboot() {
    return {
      isSetupOnHold: () => this.isSetupOnHold,
      holdSetupUntilResolved: (pluginName, reason, promise) => {
        if (this.waitUntilCanSetupPromise) {
          throw new Error('Cannot hold boot at this stage.');
        }

        this.log.info(`"${pluginName}" plugin is holding setup: ${reason}`);
        this.isSetupOnHold = true;
        this.promiseList.push(promise);
      },
      waitUntilCanSetup: () => {
        if (!this.waitUntilCanSetupPromise) {
          this.waitUntilCanSetupPromise = Promise.all(this.promiseList).then(results => ({
            shouldReloadConfig: results.some(result => result === null || result === void 0 ? void 0 : result.shouldReloadConfig)
          })).catch(err => {
            this.log.error(err);
            throw err;
          }).finally(() => this.isSetupOnHold = false);
        }

        return this.waitUntilCanSetupPromise;
      }
    };
  }

  stop() {
    this.isSetupOnHold = false;
    this.promiseList.length = 0;
    this.waitUntilCanSetupPromise = undefined;
  }

}

exports.PrebootService = PrebootService;