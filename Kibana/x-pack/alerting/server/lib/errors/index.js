"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "AlertTypeDisabledError", {
  enumerable: true,
  get: function () {
    return _alert_type_disabled.AlertTypeDisabledError;
  }
});
Object.defineProperty(exports, "getEsErrorMessage", {
  enumerable: true,
  get: function () {
    return _es_error_parser.getEsErrorMessage;
  }
});
exports.isErrorThatHandlesItsOwnResponse = isErrorThatHandlesItsOwnResponse;

var _es_error_parser = require("./es_error_parser");

var _alert_type_disabled = require("./alert_type_disabled");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function isErrorThatHandlesItsOwnResponse(e) {
  return typeof e.sendResponse === 'function';
}