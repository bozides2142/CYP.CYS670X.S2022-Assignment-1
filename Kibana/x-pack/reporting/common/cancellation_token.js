"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CancellationToken = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class CancellationToken {
  constructor() {
    (0, _defineProperty2.default)(this, "_isCancelled", void 0);
    (0, _defineProperty2.default)(this, "_callbacks", void 0);
    (0, _defineProperty2.default)(this, "on", callback => {
      if (!(0, _lodash.isFunction)(callback)) {
        throw new Error('Expected callback to be a function');
      }

      if (this._isCancelled) {
        callback();
        return;
      }

      this._callbacks.push(callback);
    });
    (0, _defineProperty2.default)(this, "cancel", () => {
      this._isCancelled = true;

      this._callbacks.forEach(callback => callback());
    });
    this._isCancelled = false;
    this._callbacks = [];
  }

  isCancelled() {
    return this._isCancelled;
  }

}

exports.CancellationToken = CancellationToken;