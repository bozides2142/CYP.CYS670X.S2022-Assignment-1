"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VisualizationsPlugin = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _i18n = require("@kbn/i18n");

var _configSchema = require("@kbn/config-schema");

var _constants = require("../common/constants");

var _usage_collector = require("./usage_collector");

var _capabilities_provider = require("./capabilities_provider");

var _make_visualize_embeddable_factory = require("./embeddable/make_visualize_embeddable_factory");

var _saved_objects = require("./saved_objects");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class VisualizationsPlugin {
  constructor(initializerContext) {
    (0, _defineProperty2.default)(this, "logger", void 0);
    this.logger = initializerContext.logger.get();
  }

  setup(core, plugins) {
    this.logger.debug('visualizations: Setup');
    const getSearchSourceMigrations = plugins.data.search.searchSource.getAllMigrations.bind(plugins.data.search.searchSource);
    core.savedObjects.registerType((0, _saved_objects.getVisualizationSavedObjectType)(getSearchSourceMigrations));
    core.capabilities.registerProvider(_capabilities_provider.capabilitiesProvider);
    core.uiSettings.register({
      [_constants.VISUALIZE_ENABLE_LABS_SETTING]: {
        name: _i18n.i18n.translate('visualizations.advancedSettings.visualizeEnableLabsTitle', {
          defaultMessage: 'Enable technical preview visualizations'
        }),
        value: true,
        description: _i18n.i18n.translate('visualizations.advancedSettings.visualizeEnableLabsText', {
          defaultMessage: `Allows users to create, view, and edit visualizations that are in technical preview.
            If disabled, only visualizations that are considered production-ready are available to the user.`
        }),
        category: ['visualization'],
        schema: _configSchema.schema.boolean()
      }
    });

    if (plugins.usageCollection) {
      (0, _usage_collector.registerVisualizationsCollector)(plugins.usageCollection);
    }

    plugins.embeddable.registerEmbeddableFactory((0, _make_visualize_embeddable_factory.makeVisualizeEmbeddableFactory)(getSearchSourceMigrations)());
    return {};
  }

  start(core) {
    this.logger.debug('visualizations: Started');
    return {};
  }

  stop() {}

}

exports.VisualizationsPlugin = VisualizationsPlugin;