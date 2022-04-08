"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChartsServerPlugin = void 0;

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
class ChartsServerPlugin {
  setup(core, dependencies) {
    dependencies.expressions.registerFunction(_common.palette);
    dependencies.expressions.registerFunction(_common.systemPalette);
    core.uiSettings.register({
      [_common.COLOR_MAPPING_SETTING]: {
        name: _i18n.i18n.translate('charts.advancedSettings.visualization.colorMappingTitle', {
          defaultMessage: 'Color mapping'
        }),
        value: JSON.stringify({
          Count: '#00A69B'
        }),
        type: 'json',
        description: _i18n.i18n.translate('charts.advancedSettings.visualization.colorMappingText', {
          defaultMessage: 'Maps values to specific colors in charts using the <strong>Compatibility</strong> palette.'
        }),
        deprecation: {
          message: _i18n.i18n.translate('charts.advancedSettings.visualization.colorMappingTextDeprecation', {
            defaultMessage: 'This setting is deprecated and will not be supported in a future version.'
          }),
          docLinksKey: 'visualizationSettings'
        },
        category: ['visualization'],
        schema: _configSchema.schema.string()
      },
      [_common.LEGACY_TIME_AXIS]: {
        name: _i18n.i18n.translate('charts.advancedSettings.visualization.useLegacyTimeAxis.name', {
          defaultMessage: 'Legacy chart time axis'
        }),
        value: false,
        description: _i18n.i18n.translate('charts.advancedSettings.visualization.useLegacyTimeAxis.description', {
          defaultMessage: 'Enables the legacy time axis for charts in Lens, Discover, Visualize and TSVB'
        }),
        category: ['visualization'],
        schema: _configSchema.schema.boolean()
      }
    });
    return {};
  }

  start() {
    return {};
  }

  stop() {}

}

exports.ChartsServerPlugin = ChartsServerPlugin;