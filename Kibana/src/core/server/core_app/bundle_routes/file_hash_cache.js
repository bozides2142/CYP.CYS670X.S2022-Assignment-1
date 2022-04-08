"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FileHashCache = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _lruCache = _interopRequireDefault(require("lru-cache"));

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/** @internal */
class FileHashCache {
  constructor(maxSize = 250) {
    (0, _defineProperty2.default)(this, "lru", void 0);
    this.lru = new _lruCache.default(maxSize);
  }

  get(key) {
    return this.lru.get(key);
  }

  set(key, value) {
    this.lru.set(key, value);
  }

  del(key) {
    this.lru.del(key);
  }

}

exports.FileHashCache = FileHashCache;