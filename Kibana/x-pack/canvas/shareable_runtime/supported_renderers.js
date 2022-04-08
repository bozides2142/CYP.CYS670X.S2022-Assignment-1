"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderFunctions = exports.renderFunctionNames = void 0;

var _markdown = require("../canvas_plugin_src/renderers/markdown");

var _pie = require("../canvas_plugin_src/renderers/pie");

var _plot = require("../canvas_plugin_src/renderers/plot");

var _table = require("../canvas_plugin_src/renderers/table");

var _text = require("../canvas_plugin_src/renderers/text");

var _public = require("../../../../src/plugins/expression_image/public");

var _public2 = require("../../../../src/plugins/expression_error/public");

var _public3 = require("../../../../src/plugins/expression_reveal_image/public");

var _public4 = require("../../../../src/plugins/expression_repeat_image/public");

var _public5 = require("../../../../src/plugins/expression_shape/public");

var _public6 = require("../../../../src/plugins/expression_metric/public");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const unboxFactory = factory => factory();

const renderFunctionsFactories = [_markdown.getMarkdownRenderer, _text.getTextRenderer, _table.getTableRenderer, _public2.getErrorRenderer, _public2.getDebugRenderer, _public.getImageRenderer, _public5.getShapeRenderer, _public5.getProgressRenderer, _public3.getRevealImageRenderer, _public4.getRepeatImageRenderer, _public6.getMetricRenderer];
/**
 * This is a collection of renderers which are bundled with the runtime.  If
 * a renderer is not listed here, but is used by the Shared Workpad, it will
 * not render.  This includes any plugins.
 */

const renderFunctions = [_pie.pie, _plot.plot, ...renderFunctionsFactories.map(unboxFactory)];
exports.renderFunctions = renderFunctions;
const renderFunctionNames = [...renderFunctions.map(fn => fn().name)];
exports.renderFunctionNames = renderFunctionNames;