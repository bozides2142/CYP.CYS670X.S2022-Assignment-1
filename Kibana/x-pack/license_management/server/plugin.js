"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LicenseManagementServerPlugin = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _routes = require("./routes");

var _shared_imports = require("./shared_imports");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class LicenseManagementServerPlugin {
  constructor() {
    (0, _defineProperty2.default)(this, "apiRoutes", new _routes.ApiRoutes());
  }

  setup({
    http,
    getStartServices
  }, {
    features,
    security
  }) {
    const router = http.createRouter();
    features.registerElasticsearchFeature({
      id: 'license_management',
      management: {
        stack: ['license_management']
      },
      privileges: [{
        requiredClusterPrivileges: ['manage'],
        ui: []
      }]
    });
    getStartServices().then(([, {
      licensing
    }]) => {
      this.apiRoutes.setup({
        router,
        plugins: {
          licensing
        },
        lib: {
          handleEsError: _shared_imports.handleEsError
        },
        config: {
          isSecurityEnabled: security !== undefined
        }
      });
    });
  }

  start() {}

  stop() {}

}

exports.LicenseManagementServerPlugin = LicenseManagementServerPlugin;