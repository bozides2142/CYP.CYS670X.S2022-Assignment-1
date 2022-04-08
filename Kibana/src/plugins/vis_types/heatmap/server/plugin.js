"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUiSettingsConfig = exports.VisTypeHeatmapServerPlugin = void 0;

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
  // TODO: Remove this when vislib heatmap is removed
  [_common.LEGACY_HEATMAP_CHARTS_LIBRARY]: {
    name: _i18n.i18n.translate('visTypeHeatmap.advancedSettings.visualization.legacyHeatmapChartsLibrary.name', {
      defaultMessage: 'Heatmap legacy charts library'
    }),
    requiresPageReload: true,
    value: true,
    description: _i18n.i18n.translate('visTypeHeatmap.advancedSettings.visualization.legacyHeatmapChartsLibrary.description', {
      defaultMessage: 'Enables legacy charts library for heatmap charts in visualize.'
    }),
    category: ['visualization'],
    schema: _configSchema.schema.boolean()
  }
});

exports.getUiSettingsConfig = getUiSettingsConfig;

class VisTypeHeatmapServerPlugin {
  setup(core) {
    core.uiSettings.register(getUiSettingsConfig());
    return {};
  }

  start() {
    return {};
  }

}

exports.VisTypeHeatmapServerPlugin = VisTypeHeatmapServerPlugin;