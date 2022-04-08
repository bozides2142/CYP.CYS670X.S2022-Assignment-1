"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SavedObjectsManagementPlugin = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _services = require("./services");

var _routes = require("./routes");

var _capabilities_provider = require("./capabilities_provider");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class SavedObjectsManagementPlugin {
  constructor(context) {
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "managementService$", new _rxjs.Subject());
    this.context = context;
    this.logger = this.context.logger.get();
  }

  setup({
    http,
    capabilities
  }) {
    this.logger.debug('Setting up SavedObjectsManagement plugin');
    (0, _routes.registerRoutes)({
      http,
      managementServicePromise: this.managementService$.pipe((0, _operators.first)()).toPromise()
    });
    capabilities.registerProvider(_capabilities_provider.capabilitiesProvider);
    return {};
  }

  start(core) {
    this.logger.debug('Starting up SavedObjectsManagement plugin');
    const managementService = new _services.SavedObjectsManagement(core.savedObjects.getTypeRegistry());
    this.managementService$.next(managementService);
    return {};
  }

}

exports.SavedObjectsManagementPlugin = SavedObjectsManagementPlugin;