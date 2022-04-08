"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CapabilitiesService = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _merge_capabilities = require("./merge_capabilities");

var _resolve_capabilities = require("./resolve_capabilities");

var _routes = require("./routes");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const defaultCapabilities = {
  navLinks: {},
  management: {},
  catalogue: {}
};
/** @internal */

class CapabilitiesService {
  constructor(core) {
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "capabilitiesProviders", []);
    (0, _defineProperty2.default)(this, "capabilitiesSwitchers", []);
    (0, _defineProperty2.default)(this, "resolveCapabilities", void 0);
    this.logger = core.logger.get('capabilities-service');
    this.resolveCapabilities = (0, _resolve_capabilities.getCapabilitiesResolver)(() => (0, _merge_capabilities.mergeCapabilities)(defaultCapabilities, ...this.capabilitiesProviders.map(provider => provider())), () => this.capabilitiesSwitchers);
  }

  preboot(prebootDeps) {
    this.logger.debug('Prebooting capabilities service'); // The preboot server has no need for real capabilities.
    // Returning the un-augmented defaults is sufficient.

    prebootDeps.http.registerRoutes('', router => {
      (0, _routes.registerRoutes)(router, async () => defaultCapabilities);
    });
  }

  setup(setupDeps) {
    this.logger.debug('Setting up capabilities service');
    (0, _routes.registerRoutes)(setupDeps.http.createRouter(''), this.resolveCapabilities);
    return {
      registerProvider: provider => {
        this.capabilitiesProviders.push(provider);
      },
      registerSwitcher: switcher => {
        this.capabilitiesSwitchers.push(switcher);
      }
    };
  }

  start() {
    return {
      resolveCapabilities: (request, options) => {
        var _options$useDefaultCa;

        return this.resolveCapabilities(request, [], (_options$useDefaultCa = options === null || options === void 0 ? void 0 : options.useDefaultCapabilities) !== null && _options$useDefaultCa !== void 0 ? _options$useDefaultCa : false);
      }
    };
  }

}

exports.CapabilitiesService = CapabilitiesService;