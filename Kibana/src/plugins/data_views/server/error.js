"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ErrorIndexPatternNotFound = exports.ErrorIndexPatternFieldNotFound = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/* eslint-disable max-classes-per-file */
class ErrorIndexPatternNotFound extends Error {
  constructor(message) {
    super(message);
    (0, _defineProperty2.default)(this, "is404", true);
    Object.setPrototypeOf(this, ErrorIndexPatternNotFound.prototype);
  }

}

exports.ErrorIndexPatternNotFound = ErrorIndexPatternNotFound;

class ErrorIndexPatternFieldNotFound extends ErrorIndexPatternNotFound {
  constructor(indexPatternId, fieldName) {
    super(`Field [index_pattern = ${indexPatternId}, field = ${fieldName}] not found.`);
  }

}

exports.ErrorIndexPatternFieldNotFound = ErrorIndexPatternFieldNotFound;