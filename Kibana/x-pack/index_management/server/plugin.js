"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IndexMgmtServerPlugin = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _plugin = require("../common/constants/plugin");

var _routes = require("./routes");

var _services = require("./services");

var _shared_imports = require("./shared_imports");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class IndexMgmtServerPlugin {
  constructor(initContext) {
    (0, _defineProperty2.default)(this, "apiRoutes", void 0);
    (0, _defineProperty2.default)(this, "indexDataEnricher", void 0);
    this.apiRoutes = new _routes.ApiRoutes();
    this.indexDataEnricher = new _services.IndexDataEnricher();
  }

  setup({
    http,
    getStartServices
  }, {
    features,
    security
  }) {
    features.registerElasticsearchFeature({
      id: _plugin.PLUGIN.id,
      management: {
        data: ['index_management']
      },
      privileges: [{
        // manage_index_templates is also required, but we will disable specific parts of the
        // UI if this privilege is missing.
        requiredClusterPrivileges: ['monitor'],
        ui: []
      }]
    });
    this.apiRoutes.setup({
      router: http.createRouter(),
      config: {
        isSecurityEnabled: () => security !== undefined && security.license.isEnabled()
      },
      indexDataEnricher: this.indexDataEnricher,
      lib: {
        handleEsError: _shared_imports.handleEsError
      }
    });
    return {
      indexDataEnricher: {
        add: this.indexDataEnricher.add.bind(this.indexDataEnricher)
      }
    };
  }

  start() {}

  stop() {}

}

exports.IndexMgmtServerPlugin = IndexMgmtServerPlugin;