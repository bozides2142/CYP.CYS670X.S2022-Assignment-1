"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IngestPipelinesPlugin = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _routes = require("./routes");

var _shared_imports = require("./shared_imports");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class IngestPipelinesPlugin {
  constructor() {
    (0, _defineProperty2.default)(this, "apiRoutes", void 0);
    this.apiRoutes = new _routes.ApiRoutes();
  }

  setup({
    http
  }, {
    security,
    features
  }) {
    const router = http.createRouter();
    features.registerElasticsearchFeature({
      id: 'ingest_pipelines',
      management: {
        ingest: ['ingest_pipelines']
      },
      privileges: [{
        ui: [],
        requiredClusterPrivileges: ['manage_pipeline', 'cluster:monitor/nodes/info']
      }]
    });
    this.apiRoutes.setup({
      router,
      config: {
        isSecurityEnabled: () => security !== undefined && security.license.isEnabled()
      },
      lib: {
        handleEsError: _shared_imports.handleEsError
      }
    });
  }

  start() {}

  stop() {}

}

exports.IngestPipelinesPlugin = IngestPipelinesPlugin;