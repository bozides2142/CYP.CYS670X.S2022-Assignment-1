"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderFunctions = exports.renderFunctionFactories = void 0;

var _markdown = require("./markdown");

var _pie = require("./pie");

var _plot = require("./plot");

var _text = require("./text");

var _table = require("./table");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const renderFunctions = [_pie.pie, _plot.plot];
exports.renderFunctions = renderFunctions;
const renderFunctionFactories = [_markdown.markdownFactory, _table.tableFactory, _text.textFactory];
exports.renderFunctionFactories = renderFunctionFactories;