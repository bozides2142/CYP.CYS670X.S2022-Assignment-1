"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "EXPRESSION_METRIC_NAME", {
  enumerable: true,
  get: function () {
    return _constants.EXPRESSION_METRIC_NAME;
  }
});
exports.PLUGIN_NAME = exports.PLUGIN_ID = void 0;
Object.defineProperty(exports, "metricVisFunction", {
  enumerable: true,
  get: function () {
    return _expression_functions.metricVisFunction;
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
const PLUGIN_ID = 'expressionMetricVis';
exports.PLUGIN_ID = PLUGIN_ID;
const PLUGIN_NAME = 'expressionMetricVis';
exports.PLUGIN_NAME = PLUGIN_NAME;