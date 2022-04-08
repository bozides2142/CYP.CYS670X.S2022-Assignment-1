"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WrappedElasticsearchClientError = void 0;
exports.unwrapEsResponse = unwrapEsResponse;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _elasticsearch = require("@elastic/elasticsearch");

var _util = require("util");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class WrappedElasticsearchClientError extends Error {
  constructor(originalError) {
    super(originalError.message);
    (0, _defineProperty2.default)(this, "originalError", void 0);
    const stack = this.stack;
    this.originalError = originalError;

    if (originalError instanceof _elasticsearch.errors.ResponseError) {
      // make sure ES response body is visible when logged to the console
      // @ts-expect-error
      this.stack = {
        valueOf() {
          var _stack$valueOf;

          const value = (_stack$valueOf = stack === null || stack === void 0 ? void 0 : stack.valueOf()) !== null && _stack$valueOf !== void 0 ? _stack$valueOf : '';
          return value;
        },

        toString() {
          const value = (stack === null || stack === void 0 ? void 0 : stack.toString()) + `\nResponse: ${(0, _util.inspect)(originalError.meta.body, {
            depth: null
          })}\n`;
          return value;
        }

      };
    }
  }

}

exports.WrappedElasticsearchClientError = WrappedElasticsearchClientError;

function unwrapEsResponse(responsePromise) {
  return responsePromise.then(res => res.body).catch(err => {
    // make sure stacktrace is relative to where client was called
    throw new WrappedElasticsearchClientError(err);
  });
}