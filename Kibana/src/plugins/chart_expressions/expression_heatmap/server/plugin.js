"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExpressionHeatmapPlugin = void 0;

var _common = require("../common");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class ExpressionHeatmapPlugin {
  setup(core, {
    expressions
  }) {
    expressions.registerFunction(_common.heatmapFunction);
    expressions.registerFunction(_common.heatmapLegendConfig);
    expressions.registerFunction(_common.heatmapGridConfig);
  }

  start(core) {}

  stop() {}

}

exports.ExpressionHeatmapPlugin = ExpressionHeatmapPlugin;