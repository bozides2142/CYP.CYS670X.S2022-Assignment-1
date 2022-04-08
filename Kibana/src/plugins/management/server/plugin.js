"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ManagementServerPlugin = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _locator = require("../common/locator");

var _capabilities_provider = require("./capabilities_provider");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class ManagementServerPlugin {
  constructor(initializerContext) {
    (0, _defineProperty2.default)(this, "logger", void 0);
    this.logger = initializerContext.logger.get();
  }

  setup(core, {
    share
  }) {
    this.logger.debug('management: Setup');
    const locator = share.url.locators.create(new _locator.ManagementAppLocatorDefinition());
    core.capabilities.registerProvider(_capabilities_provider.capabilitiesProvider);
    return {
      locator
    };
  }

  start(core) {
    this.logger.debug('management: Started');
    return {};
  }

  stop() {}

}

exports.ManagementServerPlugin = ManagementServerPlugin;