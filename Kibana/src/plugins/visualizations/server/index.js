"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "VISUALIZE_ENABLE_LABS_SETTING", {
  enumerable: true,
  get: function () {
    return _constants.VISUALIZE_ENABLE_LABS_SETTING;
  }
});
exports.plugin = plugin;

var _plugin = require("./plugin");

var _constants = require("../common/constants");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
//  This exports static code and TypeScript types,
//  as well as, Kibana Platform `plugin()` initializer.
function plugin(initializerContext) {
  return new _plugin.VisualizationsPlugin(initializerContext);
}