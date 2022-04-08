"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CustomIntegrationsPlugin = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _custom_integration_registry = require("./custom_integration_registry");

var _define_routes = require("./routes/define_routes");

var _language_clients = require("./language_clients");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class CustomIntegrationsPlugin {
  constructor(initializerContext) {
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "customIngegrationRegistry", void 0);
    (0, _defineProperty2.default)(this, "branch", void 0);
    this.logger = initializerContext.logger.get();
    this.customIngegrationRegistry = new _custom_integration_registry.CustomIntegrationRegistry(this.logger, initializerContext.env.mode.dev);
    this.branch = initializerContext.env.packageInfo.branch;
  }

  setup(core) {
    this.logger.debug('customIntegrations: Setup');
    const router = core.http.createRouter();
    (0, _define_routes.defineRoutes)(router, this.customIngegrationRegistry);
    (0, _language_clients.registerLanguageClients)(core, this.customIngegrationRegistry, this.branch);
    return {
      registerCustomIntegration: integration => {
        this.customIngegrationRegistry.registerCustomIntegration({
          type: 'ui_link',
          ...integration
        });
      },
      getAppendCustomIntegrations: () => {
        return this.customIngegrationRegistry.getAppendCustomIntegrations();
      }
    };
  }

  start(core) {
    this.logger.debug('customIntegrations: Started');
    return {};
  }

  stop() {}

}

exports.CustomIntegrationsPlugin = CustomIntegrationsPlugin;