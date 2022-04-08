"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.colorMapsMock = void 0;

var _color_maps = require("./color_maps");

var _heatmap_color = require("./heatmap_color");

var _truncated_color_maps = require("./truncated_color_maps");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
// Note: Using actual values due to existing test dependencies
const colorMapsMock = {
  getHeatmapColors: jest.fn(_heatmap_color.getHeatmapColors),
  vislibColorMaps: _color_maps.vislibColorMaps,
  colorSchemas: _color_maps.colorSchemas,
  truncatedColorMaps: _truncated_color_maps.truncatedColorMaps,
  truncatedColorSchemas: _truncated_color_maps.truncatedColorSchemas
};
exports.colorMapsMock = colorMapsMock;