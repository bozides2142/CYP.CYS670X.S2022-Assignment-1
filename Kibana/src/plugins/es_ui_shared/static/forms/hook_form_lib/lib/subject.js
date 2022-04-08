"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Subject = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class Subject {
  constructor(value) {
    (0, _defineProperty2.default)(this, "callbacks", new Set());
    (0, _defineProperty2.default)(this, "value", void 0);
    this.value = value;
  }

  subscribe(fn) {
    this.callbacks.add(fn);
    /**
     * We immediately call the function inside the subscribe so the consumer
     * receives the value immediately, withouth the need to wait for a change.
     */

    fn(this.value);

    const unsubscribe = () => this.callbacks.delete(fn);

    return {
      unsubscribe
    };
  }

  next(value) {
    if (value !== this.value) {
      this.value = value;
      this.callbacks.forEach(fn => fn(value));
    }
  }

}

exports.Subject = Subject;