"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ErrorWithReason = void 0;
exports.getReasonFromError = getReasonFromError;
exports.isErrorWithReason = isErrorWithReason;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _types = require("../types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class ErrorWithReason extends Error {
  constructor(reason, error) {
    super(error.message);
    (0, _defineProperty2.default)(this, "reason", void 0);
    (0, _defineProperty2.default)(this, "error", void 0);
    this.error = error;
    this.reason = reason;
  }

}

exports.ErrorWithReason = ErrorWithReason;

function getReasonFromError(error) {
  if (isErrorWithReason(error)) {
    return error.reason;
  }

  return _types.AlertExecutionStatusErrorReasons.Unknown;
}

function isErrorWithReason(error) {
  return error instanceof ErrorWithReason;
}