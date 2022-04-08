"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Plugin = exports.EnhancedDataServerPlugin = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _routes = require("./routes");

var _saved_objects = require("./saved_objects");

var _collectors = require("./collectors");

var _search = require("./search");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class EnhancedDataServerPlugin {
  constructor(initializerContext) {
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "sessionService", void 0);
    (0, _defineProperty2.default)(this, "config", void 0);
    this.initializerContext = initializerContext;
    this.logger = initializerContext.logger.get('data_enhanced');
    this.config = this.initializerContext.config.get();
  }

  setup(core, deps) {
    core.savedObjects.registerType(_saved_objects.searchSessionSavedObjectType);
    this.sessionService = new _search.SearchSessionService(this.logger, this.config, this.initializerContext.env.packageInfo.version, deps.security);

    deps.data.__enhance({
      search: {
        sessionService: this.sessionService
      }
    });

    const router = core.http.createRouter();
    (0, _routes.registerSessionRoutes)(router, this.logger);
    this.sessionService.setup(core, {
      taskManager: deps.taskManager
    });

    if (deps.usageCollection) {
      (0, _collectors.registerUsageCollector)(deps.usageCollection, core.savedObjects.getKibanaIndex(), this.logger);
    }
  }

  start(core, {
    taskManager
  }) {
    this.sessionService.start(core, {
      taskManager
    });
  }

  stop() {
    this.sessionService.stop();
  }

}

exports.Plugin = exports.EnhancedDataServerPlugin = EnhancedDataServerPlugin;