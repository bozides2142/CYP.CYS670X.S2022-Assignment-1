"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.config = void 0;
exports.plugin = plugin;

var _config = require("../config");

var _plugin = require("./plugin");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const config = {
  exposeToBrowser: {
    enableExternalUrls: true
  },
  schema: _config.configSchema
};
exports.config = config;

function plugin(initializerContext) {
  return new _plugin.VisTypeVegaPlugin(initializerContext);
}