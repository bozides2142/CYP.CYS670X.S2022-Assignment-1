"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VisTypeVegaPlugin = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _usage_collector = require("./usage_collector");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class VisTypeVegaPlugin {
  constructor(initializerContext) {
    (0, _defineProperty2.default)(this, "config", void 0);
    this.config = initializerContext.config.legacy.globalConfig$;
  }

  setup(core, {
    home,
    usageCollection
  }) {
    if (usageCollection) {
      (0, _usage_collector.registerVegaUsageCollector)(usageCollection, this.config, {
        home
      });
    }

    return {};
  }

  start(core) {
    return {};
  }

  stop() {}

}

exports.VisTypeVegaPlugin = VisTypeVegaPlugin;