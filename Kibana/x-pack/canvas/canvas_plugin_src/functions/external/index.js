"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initFunctions = initFunctions;

var _embeddable = require("./embeddable");

var _saved_lens = require("./saved_lens");

var _saved_map = require("./saved_map");

var _saved_search = require("./saved_search");

var _saved_visualization = require("./saved_visualization");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function initFunctions(initialize) {
  return [(0, _embeddable.embeddableFunctionFactory)(initialize), _saved_lens.savedLens, _saved_map.savedMap, _saved_search.savedSearch, _saved_visualization.savedVisualization];
}