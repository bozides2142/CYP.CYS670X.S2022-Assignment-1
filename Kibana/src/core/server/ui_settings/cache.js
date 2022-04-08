"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Cache = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const oneSec = 1000;
const defMaxAge = 5 * oneSec;
/**
 * @internal
 */

class Cache {
  /**
   * Delete cached value after maxAge ms.
   */
  constructor(maxAge = defMaxAge) {
    (0, _defineProperty2.default)(this, "value", void 0);
    (0, _defineProperty2.default)(this, "timer", void 0);
    this.maxAge = maxAge;
    this.value = null;
  }

  get() {
    return this.value;
  }

  set(value) {
    this.del();
    this.value = value;
    this.timer = setTimeout(() => this.del(), this.maxAge);
  }

  del() {
    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.value = null;
  }

}

exports.Cache = Cache;