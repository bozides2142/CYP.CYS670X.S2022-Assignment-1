"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CanvasPlugin = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _constants = require("../common/lib/constants");

var _feature = require("./feature");

var _routes = require("./routes");

var _collectors = require("./collectors");

var _sample_data = require("./sample_data");

var _setup_interpreter = require("./setup_interpreter");

var _saved_objects = require("./saved_objects");

var _templates = require("./templates");

var _essql_strategy = require("./lib/essql_strategy");

var _ui_settings = require("./ui_settings");

var _workpad_route_context = require("./workpad_route_context");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class CanvasPlugin {
  constructor(initializerContext) {
    (0, _defineProperty2.default)(this, "logger", void 0);
    this.initializerContext = initializerContext;
    this.logger = initializerContext.logger.get();
  }

  setup(coreSetup, plugins) {
    const expressionsFork = plugins.expressions.fork();
    (0, _setup_interpreter.setupInterpreter)(expressionsFork, {
      embeddablePersistableStateService: {
        extract: plugins.embeddable.extract,
        inject: plugins.embeddable.inject,
        getAllMigrations: plugins.embeddable.getAllMigrations
      }
    });
    const deps = {
      expressions: expressionsFork
    };
    coreSetup.uiSettings.register((0, _ui_settings.getUISettings)());
    coreSetup.savedObjects.registerType((0, _saved_objects.customElementType)(deps));
    coreSetup.savedObjects.registerType((0, _saved_objects.workpadTypeFactory)(deps));
    coreSetup.savedObjects.registerType((0, _saved_objects.workpadTemplateType)(deps));
    plugins.features.registerKibanaFeature((0, _feature.getCanvasFeature)(plugins));
    const contextProvider = (0, _workpad_route_context.createWorkpadRouteContext)({
      expressions: expressionsFork
    });
    coreSetup.http.registerRouteHandlerContext('canvas', contextProvider);
    const canvasRouter = coreSetup.http.createRouter();
    (0, _routes.initRoutes)({
      router: canvasRouter,
      expressions: expressionsFork,
      bfetch: plugins.bfetch,
      logger: this.logger
    });
    (0, _sample_data.loadSampleData)(plugins.home.sampleData.addSavedObjectsToSampleDataset, plugins.home.sampleData.addAppLinksToSampleDataset); // we need the kibana index for the Canvas usage collector

    const kibanaIndex = coreSetup.savedObjects.getKibanaIndex();
    (0, _collectors.registerCanvasUsageCollector)(plugins.usageCollection, kibanaIndex);
    coreSetup.getStartServices().then(([_, depsStart]) => {
      const strategy = (0, _essql_strategy.essqlSearchStrategyProvider)();
      plugins.data.search.registerSearchStrategy(_constants.ESSQL_SEARCH_STRATEGY, strategy);
    });
  }

  start(coreStart) {
    const client = coreStart.savedObjects.createInternalRepository();
    (0, _templates.initializeTemplates)(client);
  }

  stop() {}

}

exports.CanvasPlugin = CanvasPlugin;