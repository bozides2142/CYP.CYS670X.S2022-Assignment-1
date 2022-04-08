"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "BASE_PATH", {
  enumerable: true,
  get: function () {
    return _constants.BASE_PATH;
  }
});
Object.defineProperty(exports, "DEFAULT_DARK_MODE", {
  enumerable: true,
  get: function () {
    return _constants.DEFAULT_DARK_MODE;
  }
});
Object.defineProperty(exports, "OSQUERY_INTEGRATION_NAME", {
  enumerable: true,
  get: function () {
    return _constants.OSQUERY_INTEGRATION_NAME;
  }
});
exports.PLUGIN_NAME = exports.PLUGIN_ID = void 0;

var _constants = require("./constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const PLUGIN_ID = 'osquery';
exports.PLUGIN_ID = PLUGIN_ID;
const PLUGIN_NAME = 'Osquery';
exports.PLUGIN_NAME = PLUGIN_NAME;