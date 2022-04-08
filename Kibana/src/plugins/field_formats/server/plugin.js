"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FieldFormatsPlugin = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _lodash = require("lodash");

var _converters = require("./lib/converters");

var _common = require("../common");

var _ui_settings = require("./ui_settings");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class FieldFormatsPlugin {
  constructor(initializerContext) {
    (0, _defineProperty2.default)(this, "fieldFormats", [_converters.DateFormat, _converters.DateNanosFormat, ..._common.baseFormatters]);
  }

  setup(core) {
    core.uiSettings.register((0, _ui_settings.getUiSettings)());
    return {
      register: customFieldFormat => this.fieldFormats.push(customFieldFormat)
    };
  }

  start(core) {
    return {
      fieldFormatServiceFactory: async uiSettings => {
        const fieldFormatsRegistry = new _common.FieldFormatsRegistry();
        const coreUiConfigs = await uiSettings.getAll();
        const registeredUiSettings = uiSettings.getRegistered();
        const uiConfigs = { ...coreUiConfigs
        };
        Object.keys(registeredUiSettings).forEach(key => {
          if ((0, _lodash.has)(uiConfigs, key) && registeredUiSettings[key].type === 'json') {
            uiConfigs[key] = JSON.parse(uiConfigs[key]);
          }
        });
        fieldFormatsRegistry.init(key => uiConfigs[key], {}, this.fieldFormats);
        return fieldFormatsRegistry;
      }
    };
  }

  stop() {}

}

exports.FieldFormatsPlugin = FieldFormatsPlugin;