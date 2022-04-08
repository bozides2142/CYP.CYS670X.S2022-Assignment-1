"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUiSettingsConfig = exports.VisTypePieServerPlugin = void 0;

var _i18n = require("@kbn/i18n");

var _configSchema = require("@kbn/config-schema");

var _common = require("../common");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const getUiSettingsConfig = () => ({
  // TODO: Remove this when vislib pie is removed
  // https://github.com/elastic/kibana/issues/111246
  [_common.LEGACY_PIE_CHARTS_LIBRARY]: {
    name: _i18n.i18n.translate('visTypePie.advancedSettings.visualization.legacyPieChartsLibrary.name', {
      defaultMessage: 'Pie legacy charts library'
    }),
    requiresPageReload: true,
    value: false,
    description: _i18n.i18n.translate('visTypePie.advancedSettings.visualization.legacyPieChartsLibrary.description', {
      defaultMessage: 'Enables legacy charts library for pie charts in visualize.'
    }),
    deprecation: {
      message: _i18n.i18n.translate('visTypePie.advancedSettings.visualization.legacyPieChartsLibrary.deprecation', {
        defaultMessage: 'The legacy charts library for pie in visualize is deprecated and will not be supported in a future version.'
      }),
      docLinksKey: 'visualizationSettings'
    },
    category: ['visualization'],
    schema: _configSchema.schema.boolean()
  }
});

exports.getUiSettingsConfig = getUiSettingsConfig;

class VisTypePieServerPlugin {
  setup(core) {
    core.uiSettings.register(getUiSettingsConfig());
    return {};
  }

  start() {
    return {};
  }

}

exports.VisTypePieServerPlugin = VisTypePieServerPlugin;