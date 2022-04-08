"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CacheManager = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _lruCache = _interopRequireDefault(require("lru-cache"));

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class CacheManager {
  constructor({
    cacheDurationMs
  }) {
    (0, _defineProperty2.default)(this, "cache", void 0);
    (0, _defineProperty2.default)(this, "setCache", (cacheKey, data) => {
      this.cache.set(cacheKey, data);
    });
    (0, _defineProperty2.default)(this, "getFromCache", cacheKey => {
      return this.cache.get(cacheKey);
    });
    this.cache = new _lruCache.default({
      max: 1,
      maxAge: cacheDurationMs
    });
  }
  /**
   * Cache an object by key
   */


  /**
   * Removes all cached objects
   */
  resetCache() {
    this.cache.reset();
  }

}

exports.CacheManager = CacheManager;