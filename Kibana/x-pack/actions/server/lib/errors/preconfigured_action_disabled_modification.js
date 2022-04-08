"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PreconfiguredActionDisabledModificationError = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class PreconfiguredActionDisabledModificationError extends Error {
  constructor(message, disabledFrom) {
    super(message);
    (0, _defineProperty2.default)(this, "disabledFrom", void 0);
    this.disabledFrom = disabledFrom;
  }

  sendResponse(res) {
    return res.badRequest({
      body: {
        message: this.message
      }
    });
  }

}

exports.PreconfiguredActionDisabledModificationError = PreconfiguredActionDisabledModificationError;