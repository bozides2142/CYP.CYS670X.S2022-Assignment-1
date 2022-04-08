"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DataVisualizerPlugin = void 0;

var _register_custom_integration = require("./register_custom_integration");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class DataVisualizerPlugin {
  constructor() {}

  setup(coreSetup, plugins) {
    // home-plugin required
    if (plugins.home && plugins.customIntegrations) {
      (0, _register_custom_integration.registerWithCustomIntegrations)(plugins.customIntegrations);
    }
  }

  start(core) {}

}

exports.DataVisualizerPlugin = DataVisualizerPlugin;