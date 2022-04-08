"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeExecutionContext = makeExecutionContext;

var _lodash = require("lodash");

var _constants = require("./constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function makeExecutionContext(context) {
  return (0, _lodash.omitBy)({
    name: _constants.APP_ID,
    type: 'application',
    ...context
  }, _lodash.isUndefined);
}