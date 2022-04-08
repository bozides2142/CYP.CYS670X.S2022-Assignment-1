"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AuthHeadersStorage = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _router = require("./router");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/** @internal */
class AuthHeadersStorage {
  constructor() {
    (0, _defineProperty2.default)(this, "authHeadersCache", new WeakMap());
    (0, _defineProperty2.default)(this, "set", (request, headers) => {
      this.authHeadersCache.set((0, _router.ensureRawRequest)(request), headers);
    });
    (0, _defineProperty2.default)(this, "get", request => {
      return this.authHeadersCache.get((0, _router.ensureRawRequest)(request));
    });
  }

}

exports.AuthHeadersStorage = AuthHeadersStorage;