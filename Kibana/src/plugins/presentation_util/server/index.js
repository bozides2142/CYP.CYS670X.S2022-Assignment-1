"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "SETTING_CATEGORY", {
  enumerable: true,
  get: function () {
    return _ui_settings.SETTING_CATEGORY;
  }
});
exports.plugin = void 0;

var _plugin = require("./plugin");

var _ui_settings = require("./ui_settings");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const plugin = () => new _plugin.PresentationUtilPlugin();

exports.plugin = plugin;