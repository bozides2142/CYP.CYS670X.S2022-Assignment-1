"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PrebootCoreRouteHandlerContext = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
// eslint-disable-next-line max-classes-per-file
class PrebootCoreUiSettingsRouteHandlerContext {
  constructor(client) {
    this.client = client;
  }

}

class PrebootCoreRouteHandlerContext {
  constructor(corePreboot) {
    (0, _defineProperty2.default)(this, "uiSettings", void 0);
    this.corePreboot = corePreboot;
    this.uiSettings = new PrebootCoreUiSettingsRouteHandlerContext(this.corePreboot.uiSettings.createDefaultsClient());
  }

}

exports.PrebootCoreRouteHandlerContext = PrebootCoreRouteHandlerContext;