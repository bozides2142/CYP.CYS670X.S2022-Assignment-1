"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isImportRegular = void 0;

var _fp = require("lodash/fp");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Helper to determine if response is error response or not
 * @param importExceptionsResponse {array} successful or error responses
 * @returns {boolean}
 */


const isImportRegular = importExceptionsResponse => {
  return !(0, _fp.has)('error', importExceptionsResponse) && (0, _fp.has)('status_code', importExceptionsResponse);
};

exports.isImportRegular = isImportRegular;