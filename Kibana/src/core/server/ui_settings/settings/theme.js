"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getThemeSettings = void 0;

var _configSchema = require("@kbn/config-schema");

var _i18n = require("@kbn/i18n");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function parseThemeTags() {
  if (!process.env.KBN_OPTIMIZER_THEMES || process.env.KBN_OPTIMIZER_THEMES === '*') {
    return ['v8light', 'v8dark'];
  }

  return process.env.KBN_OPTIMIZER_THEMES.split(',').map(t => t.trim());
}

function getThemeInfo(options) {
  var _options$isDist;

  if ((_options$isDist = options === null || options === void 0 ? void 0 : options.isDist) !== null && _options$isDist !== void 0 ? _options$isDist : true) {
    return {
      defaultDarkMode: false
    };
  }

  const themeTags = parseThemeTags();
  return {
    defaultDarkMode: themeTags[0].endsWith('dark')
  };
}

const getThemeSettings = (options = {}) => {
  const {
    defaultDarkMode
  } = getThemeInfo(options);
  return {
    'theme:darkMode': {
      name: _i18n.i18n.translate('core.ui_settings.params.darkModeTitle', {
        defaultMessage: 'Dark mode'
      }),
      value: defaultDarkMode,
      description: _i18n.i18n.translate('core.ui_settings.params.darkModeText', {
        defaultMessage: `Enable a dark mode for the Kibana UI. A page refresh is required for the setting to be applied.`
      }),
      requiresPageReload: true,
      schema: _configSchema.schema.boolean()
    },

    /**
     * Theme is sticking around as there are still a number of places reading it and
     * we might use it again in the future.
     */
    'theme:version': {
      name: _i18n.i18n.translate('core.ui_settings.params.themeVersionTitle', {
        defaultMessage: 'Theme version'
      }),
      value: 'v8',
      readonly: true,
      schema: _configSchema.schema.literal('v8')
    }
  };
};

exports.getThemeSettings = getThemeSettings;