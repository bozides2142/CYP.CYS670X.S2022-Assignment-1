"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.config = exports.PluginsConfig = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _configSchema = require("@kbn/config-schema");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const configSchema = _configSchema.schema.object({
  initialize: _configSchema.schema.boolean({
    defaultValue: true
  }),

  /**
   * Defines an array of directories where another plugin should be loaded from.
   */
  paths: _configSchema.schema.arrayOf(_configSchema.schema.string(), {
    defaultValue: []
  })
});

const config = {
  path: 'plugins',
  schema: configSchema
};
/** @internal */

exports.config = config;

class PluginsConfig {
  /**
   * Indicates whether or not plugins should be initialized.
   */

  /**
   * Defines directories that we should scan for the plugin subdirectories.
   */

  /**
   * Defines directories where an additional plugin exists.
   */
  constructor(rawConfig, env) {
    (0, _defineProperty2.default)(this, "initialize", void 0);
    (0, _defineProperty2.default)(this, "pluginSearchPaths", void 0);
    (0, _defineProperty2.default)(this, "additionalPluginPaths", void 0);
    this.initialize = rawConfig.initialize;
    this.pluginSearchPaths = env.pluginSearchPaths;
    this.additionalPluginPaths = rawConfig.paths;
  }

}

exports.PluginsConfig = PluginsConfig;