"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.KbnServerError = void 0;
exports.getKbnServerError = getKbnServerError;
exports.reportServerError = reportServerError;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _elasticsearch = require("@elastic/elasticsearch");

var _common = require("../common");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class KbnServerError extends _common.KbnError {
  constructor(message, statusCode, errBody) {
    super(message);
    (0, _defineProperty2.default)(this, "errBody", void 0);
    this.statusCode = statusCode;
    this.errBody = errBody;
  }

}
/**
 * Formats any error thrown into a standardized `KbnServerError`.
 * @param e `Error` or `ElasticsearchClientError`
 * @returns `KbnServerError`
 */


exports.KbnServerError = KbnServerError;

function getKbnServerError(e) {
  var _e$message;

  if (e instanceof KbnServerError) return e;
  return new KbnServerError((_e$message = e.message) !== null && _e$message !== void 0 ? _e$message : 'Unknown error', e instanceof _elasticsearch.errors.ResponseError ? e.statusCode : 500, e instanceof _elasticsearch.errors.ResponseError ? e.body : undefined);
}
/**
 *
 * @param res Formats a `KbnServerError` into a server error response
 * @param err
 */


function reportServerError(res, err) {
  var _err$statusCode, _err$errBody;

  return res.customError({
    statusCode: (_err$statusCode = err.statusCode) !== null && _err$statusCode !== void 0 ? _err$statusCode : 500,
    body: {
      message: err.message,
      attributes: (_err$errBody = err.errBody) === null || _err$errBody === void 0 ? void 0 : _err$errBody.error
    }
  });
}