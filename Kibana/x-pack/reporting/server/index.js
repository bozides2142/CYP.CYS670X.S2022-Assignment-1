"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "ReportingCore", {
  enumerable: true,
  get: function () {
    return _core.ReportingCore;
  }
});
Object.defineProperty(exports, "config", {
  enumerable: true,
  get: function () {
    return _config.config;
  }
});
exports.plugin = void 0;

var _plugin = require("./plugin");

var _config = require("./config");

var _core = require("./core");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @internal


const plugin = initContext => new _plugin.ReportingPlugin(initContext); // @internal


exports.plugin = plugin;