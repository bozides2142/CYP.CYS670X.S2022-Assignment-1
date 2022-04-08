"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Plugin = exports.DataViewsServerPlugin = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _data_views_service_factory = require("./data_views_service_factory");

var _routes = require("./routes");

var _saved_objects = require("./saved_objects");

var _capabilities_provider = require("./capabilities_provider");

var _expressions = require("./expressions");

var _register_index_pattern_usage_collection = require("./register_index_pattern_usage_collection");

var _deprecations = require("./deprecations");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class DataViewsServerPlugin {
  constructor(initializerContext) {
    (0, _defineProperty2.default)(this, "logger", void 0);
    this.logger = initializerContext.logger.get('dataView');
  }

  setup(core, {
    expressions,
    usageCollection
  }) {
    core.savedObjects.registerType(_saved_objects.dataViewSavedObjectType);
    core.capabilities.registerProvider(_capabilities_provider.capabilitiesProvider);
    const dataViewRestCounter = usageCollection === null || usageCollection === void 0 ? void 0 : usageCollection.createUsageCounter('dataViewsRestApi');
    (0, _routes.registerRoutes)(core.http, core.getStartServices, dataViewRestCounter);
    expressions.registerFunction((0, _expressions.getIndexPatternLoad)({
      getStartServices: core.getStartServices
    }));
    (0, _register_index_pattern_usage_collection.registerIndexPatternsUsageCollector)(core.getStartServices, usageCollection);
    core.deprecations.registerDeprecations((0, _deprecations.createScriptedFieldsDeprecationsConfig)(core));
    return {};
  }

  start({
    uiSettings,
    capabilities
  }, {
    fieldFormats
  }) {
    const serviceFactory = (0, _data_views_service_factory.dataViewsServiceFactory)({
      logger: this.logger.get('indexPatterns'),
      uiSettings,
      fieldFormats,
      capabilities
    });
    return {
      indexPatternsServiceFactory: serviceFactory,
      dataViewsServiceFactory: serviceFactory
    };
  }

  stop() {}

}

exports.Plugin = exports.DataViewsServerPlugin = DataViewsServerPlugin;