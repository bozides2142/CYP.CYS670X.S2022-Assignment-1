"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.config = void 0;
Object.defineProperty(exports, "isVisSeriesData", {
  enumerable: true,
  get: function () {
    return _vis_data_utils.isVisSeriesData;
  }
});
Object.defineProperty(exports, "isVisTableData", {
  enumerable: true,
  get: function () {
    return _vis_data_utils.isVisTableData;
  }
});
exports.plugin = plugin;

var _config = require("./config");

var _plugin = require("./plugin");

var _vis_data_utils = require("../common/vis_data_utils");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const config = {
  schema: _config.config
};
exports.config = config;

function plugin(initializerContext) {
  return new _plugin.VisTypeTimeseriesPlugin(initializerContext);
}