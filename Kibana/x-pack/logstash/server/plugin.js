"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LogstashPlugin = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _routes = require("./routes");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class LogstashPlugin {
  constructor(context) {
    (0, _defineProperty2.default)(this, "logger", void 0);
    this.logger = context.logger.get();
  }

  setup(core, deps) {
    this.logger.debug('Setting up Logstash plugin');
    (0, _routes.registerRoutes)(core.http.createRouter(), deps.security);
    deps.features.registerElasticsearchFeature({
      id: 'pipelines',
      management: {
        ingest: ['pipelines']
      },
      privileges: [{
        requiredClusterPrivileges: ['manage_logstash_pipelines'],
        requiredIndexPrivileges: {},
        ui: []
      }]
    });
  }

  start(core) {}

}

exports.LogstashPlugin = LogstashPlugin;