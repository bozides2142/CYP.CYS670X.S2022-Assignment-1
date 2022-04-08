"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GaugeTicksPositions = exports.GaugeShapes = exports.GaugeLabelMajorModes = exports.GaugeColorModes = exports.GAUGE_FUNCTION_RENDERER_NAME = exports.EXPRESSION_GAUGE_NAME = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const EXPRESSION_GAUGE_NAME = 'gauge';
exports.EXPRESSION_GAUGE_NAME = EXPRESSION_GAUGE_NAME;
const GAUGE_FUNCTION_RENDERER_NAME = 'gauge_renderer';
exports.GAUGE_FUNCTION_RENDERER_NAME = GAUGE_FUNCTION_RENDERER_NAME;
const GaugeShapes = {
  horizontalBullet: 'horizontalBullet',
  verticalBullet: 'verticalBullet'
};
exports.GaugeShapes = GaugeShapes;
const GaugeTicksPositions = {
  auto: 'auto',
  bands: 'bands'
};
exports.GaugeTicksPositions = GaugeTicksPositions;
const GaugeLabelMajorModes = {
  auto: 'auto',
  custom: 'custom',
  none: 'none'
};
exports.GaugeLabelMajorModes = GaugeLabelMajorModes;
const GaugeColorModes = {
  palette: 'palette',
  none: 'none'
};
exports.GaugeColorModes = GaugeColorModes;