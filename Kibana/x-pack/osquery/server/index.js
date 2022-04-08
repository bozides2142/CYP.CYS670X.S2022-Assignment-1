"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.config = void 0;
exports.plugin = plugin;

var _plugin = require("./plugin");

var _config = require("./config");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const config = {
  schema: _config.ConfigSchema,
  exposeToBrowser: {
    actionEnabled: true,
    savedQueries: true,
    packs: true
  }
};
exports.config = config;

function plugin(initializerContext) {
  return new _plugin.OsqueryPlugin(initializerContext);
}