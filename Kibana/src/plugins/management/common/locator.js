"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ManagementAppLocatorDefinition = exports.MANAGEMENT_APP_LOCATOR = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _contants = require("./contants");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const MANAGEMENT_APP_LOCATOR = 'MANAGEMENT_APP_LOCATOR';
exports.MANAGEMENT_APP_LOCATOR = MANAGEMENT_APP_LOCATOR;

class ManagementAppLocatorDefinition {
  constructor() {
    (0, _defineProperty2.default)(this, "id", MANAGEMENT_APP_LOCATOR);
    (0, _defineProperty2.default)(this, "getLocation", async params => {
      const path = `/${params.sectionId}${params.appId ? '/' + params.appId : ''}`;
      return {
        app: _contants.MANAGEMENT_APP_ID,
        path,
        state: {}
      };
    });
  }

}

exports.ManagementAppLocatorDefinition = ManagementAppLocatorDefinition;