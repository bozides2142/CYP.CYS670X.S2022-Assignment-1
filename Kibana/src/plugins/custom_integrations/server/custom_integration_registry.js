"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CustomIntegrationRegistry = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _common = require("../common");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function isAddable(integration) {
  return !!integration.categories.length && !integration.eprOverlap;
}

function isReplacement(integration) {
  return !!integration.categories.length && !!integration.eprOverlap;
}

class CustomIntegrationRegistry {
  constructor(logger, isDev) {
    (0, _defineProperty2.default)(this, "_integrations", void 0);
    (0, _defineProperty2.default)(this, "_logger", void 0);
    (0, _defineProperty2.default)(this, "_isDev", void 0);
    this._integrations = [];
    this._logger = logger;
    this._isDev = isDev;
  }

  registerCustomIntegration(customIntegration) {
    var _customIntegration$ca;

    if (this._integrations.some(integration => {
      return integration.id === customIntegration.id;
    })) {
      const message = `Integration with id=${customIntegration.id} already exists.`;

      if (this._isDev) {
        this._logger.error(message);
      } else {
        this._logger.debug(message);
      }

      return;
    }

    const allowedCategories = ((_customIntegration$ca = customIntegration.categories) !== null && _customIntegration$ca !== void 0 ? _customIntegration$ca : []).filter(category => {
      return _common.INTEGRATION_CATEGORY_DISPLAY.hasOwnProperty(category);
    });

    this._integrations.push({ ...customIntegration,
      categories: allowedCategories
    });
  }

  getAppendCustomIntegrations() {
    return this._integrations.filter(isAddable);
  }

  getReplacementCustomIntegrations() {
    return this._integrations.filter(isReplacement);
  }

}

exports.CustomIntegrationRegistry = CustomIntegrationRegistry;