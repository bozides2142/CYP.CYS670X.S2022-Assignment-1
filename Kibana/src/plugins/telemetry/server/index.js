"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "config", {
  enumerable: true,
  get: function () {
    return _config.config;
  }
});
Object.defineProperty(exports, "getClusterUuids", {
  enumerable: true,
  get: function () {
    return _telemetry_collection.getClusterUuids;
  }
});
Object.defineProperty(exports, "getLocalStats", {
  enumerable: true,
  get: function () {
    return _telemetry_collection.getLocalStats;
  }
});
exports.plugin = void 0;

var _plugin = require("./plugin");

var _config = require("./config");

var _telemetry_collection = require("./telemetry_collection");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const plugin = initializerContext => new _plugin.TelemetryPlugin(initializerContext);

exports.plugin = plugin;