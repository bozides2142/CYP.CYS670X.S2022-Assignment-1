"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUISettings = void 0;

var _i18n = require("@kbn/i18n");

var _configSchema = require("@kbn/config-schema");

var _server = require("../../../../src/plugins/presentation_util/server");

var _common = require("../common");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * uiSettings definitions for Dashboard.
 */
const getUISettings = () => ({
  [_common.UI_SETTINGS.ENABLE_LABS_UI]: {
    name: _i18n.i18n.translate('dashboard.labs.enableUI', {
      defaultMessage: 'Enable labs button in Dashboard'
    }),
    description: _i18n.i18n.translate('dashboard.labs.enableLabsDescription', {
      defaultMessage: 'This flag determines if the viewer has access to the Labs button, a quick way to enable and disable technical preview features in Dashboard.'
    }),
    value: false,
    type: 'boolean',
    schema: _configSchema.schema.boolean(),
    category: [_server.SETTING_CATEGORY],
    requiresPageReload: true
  }
});

exports.getUISettings = getUISettings;