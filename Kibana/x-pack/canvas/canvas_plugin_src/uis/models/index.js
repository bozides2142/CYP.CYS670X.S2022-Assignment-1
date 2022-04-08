"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.modelSpecs = void 0;

var _point_series = require("./point_series");

var _math = require("./math");

var _tagcloud = require("./tagcloud");

var _metric_vis = require("./metric_vis");

var _heatmap_legend = require("./heatmap_legend");

var _heatmap_grid = require("./heatmap_grid");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const modelSpecs = [_point_series.pointseries, _math.math, _tagcloud.tagcloud, _metric_vis.metricVis, _heatmap_legend.heatmapLegend, _heatmap_grid.heatmapGrid];
exports.modelSpecs = modelSpecs;