"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "EXPRESSION_HEATMAP_NAME", {
  enumerable: true,
  get: function () {
    return _constants.EXPRESSION_HEATMAP_NAME;
  }
});
exports.PLUGIN_NAME = exports.PLUGIN_ID = void 0;
Object.defineProperty(exports, "heatmapFunction", {
  enumerable: true,
  get: function () {
    return _expression_functions.heatmapFunction;
  }
});
Object.defineProperty(exports, "heatmapGridConfig", {
  enumerable: true,
  get: function () {
    return _expression_functions.heatmapGridConfig;
  }
});
Object.defineProperty(exports, "heatmapLegendConfig", {
  enumerable: true,
  get: function () {
    return _expression_functions.heatmapLegendConfig;
  }
});

var _expression_functions = require("./expression_functions");

var _constants = require("./constants");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const PLUGIN_ID = 'expressionHeatmap';
exports.PLUGIN_ID = PLUGIN_ID;
const PLUGIN_NAME = 'expressionHeatmap';
exports.PLUGIN_NAME = PLUGIN_NAME;