"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "KBN_SCREENSHOT_MODE_ENABLED_KEY", {
  enumerable: true,
  get: function () {
    return _common.KBN_SCREENSHOT_MODE_ENABLED_KEY;
  }
});
Object.defineProperty(exports, "KBN_SCREENSHOT_MODE_HEADER", {
  enumerable: true,
  get: function () {
    return _common.KBN_SCREENSHOT_MODE_HEADER;
  }
});
exports.plugin = plugin;
Object.defineProperty(exports, "setScreenshotModeEnabled", {
  enumerable: true,
  get: function () {
    return _common.setScreenshotModeEnabled;
  }
});

var _plugin = require("./plugin");

var _common = require("../common");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function plugin() {
  return new _plugin.ScreenshotModePlugin();
}