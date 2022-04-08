"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CaseError = void 0;
exports.createCaseError = createCaseError;
exports.isCaseError = isCaseError;
exports.isHTTPError = isHTTPError;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _boom = require("@hapi/boom");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Helper class for wrapping errors while preserving the original thrown error.
 */


class CaseError extends Error {
  constructor(message, originalError) {
    super(message);
    (0, _defineProperty2.default)(this, "wrappedError", void 0);
    this.name = this.constructor.name; // for stack traces

    if (isCaseError(originalError)) {
      this.wrappedError = originalError.wrappedError;
    } else {
      this.wrappedError = originalError;
    }
  }
  /**
   * This function creates a boom representation of the error. If the wrapped error is a boom we'll grab the statusCode
   * and data from that.
   */


  boomify() {
    var _this$wrappedError$me, _this$wrappedError;

    const message = (_this$wrappedError$me = (_this$wrappedError = this.wrappedError) === null || _this$wrappedError === void 0 ? void 0 : _this$wrappedError.message) !== null && _this$wrappedError$me !== void 0 ? _this$wrappedError$me : this.message;
    let statusCode = 500;
    let data;

    if ((0, _boom.isBoom)(this.wrappedError)) {
      var _this$wrappedError2, _this$wrappedError$ou, _this$wrappedError3, _this$wrappedError3$o;

      data = (_this$wrappedError2 = this.wrappedError) === null || _this$wrappedError2 === void 0 ? void 0 : _this$wrappedError2.data;
      statusCode = (_this$wrappedError$ou = (_this$wrappedError3 = this.wrappedError) === null || _this$wrappedError3 === void 0 ? void 0 : (_this$wrappedError3$o = _this$wrappedError3.output) === null || _this$wrappedError3$o === void 0 ? void 0 : _this$wrappedError3$o.statusCode) !== null && _this$wrappedError$ou !== void 0 ? _this$wrappedError$ou : 500;
    }

    return new _boom.Boom(message, {
      data,
      statusCode
    });
  }

}
/**
 * Type guard for determining if an error is a CaseError
 */


exports.CaseError = CaseError;

function isCaseError(error) {
  return error instanceof CaseError;
}
/**
 * Type guard for determining if an error is an HTTPError
 */


function isHTTPError(error) {
  return (error === null || error === void 0 ? void 0 : error.statusCode) != null;
}
/**
 * Create a CaseError that wraps the original thrown error. This also logs the message that will be placed in the CaseError
 * if the logger was defined.
 */


function createCaseError({
  message,
  error,
  logger
}) {
  const logMessage = message !== null && message !== void 0 ? message : error === null || error === void 0 ? void 0 : error.toString();

  if (logMessage !== undefined) {
    logger === null || logger === void 0 ? void 0 : logger.error(logMessage);
  }

  return new CaseError(message, error);
}