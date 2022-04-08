"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UiSettingsServerToCommon = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class UiSettingsServerToCommon {
  constructor(uiSettings) {
    (0, _defineProperty2.default)(this, "uiSettings", void 0);
    this.uiSettings = uiSettings;
  }

  get(key) {
    return this.uiSettings.get(key);
  }

  getAll() {
    return this.uiSettings.getAll();
  }

  set(key, value) {
    return this.uiSettings.set(key, value);
  }

  remove(key) {
    return this.uiSettings.remove(key);
  }

}

exports.UiSettingsServerToCommon = UiSettingsServerToCommon;