"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUiSettings = getUiSettings;

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
function getUiSettings() {
  return {
    [_common.DISABLE_BFETCH]: {
      name: _i18n.i18n.translate('bfetch.disableBfetch', {
        defaultMessage: 'Disable request batching'
      }),
      value: false,
      description: _i18n.i18n.translate('bfetch.disableBfetchDesc', {
        defaultMessage: 'Disables requests batching. This increases number of HTTP requests from Kibana, but allows to debug requests individually.'
      }),
      schema: _configSchema.schema.boolean(),
      category: []
    },
    [_common.DISABLE_BFETCH_COMPRESSION]: {
      name: _i18n.i18n.translate('bfetch.disableBfetchCompression', {
        defaultMessage: 'Disable batch compression'
      }),
      value: false,
      description: _i18n.i18n.translate('bfetch.disableBfetchCompressionDesc', {
        defaultMessage: 'Disable batch compression. This allows you to debug individual requests, but increases response size.'
      }),
      schema: _configSchema.schema.boolean(),
      category: []
    }
  };
}