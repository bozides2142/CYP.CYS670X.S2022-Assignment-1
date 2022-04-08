"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AuthStatus = exports.AuthStateStorage = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _router = require("./router");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Status indicating an outcome of the authentication.
 * @public
 */
let AuthStatus;
/**
 * Gets authentication state for a request. Returned by `auth` interceptor.
 * @param request {@link KibanaRequest} - an incoming request.
 * @public
 */

exports.AuthStatus = AuthStatus;

(function (AuthStatus) {
  AuthStatus["authenticated"] = "authenticated";
  AuthStatus["unauthenticated"] = "unauthenticated";
  AuthStatus["unknown"] = "unknown";
})(AuthStatus || (exports.AuthStatus = AuthStatus = {}));

/** @internal */
class AuthStateStorage {
  constructor(canBeAuthenticated) {
    (0, _defineProperty2.default)(this, "storage", new WeakMap());
    (0, _defineProperty2.default)(this, "set", (request, state) => {
      this.storage.set((0, _router.ensureRawRequest)(request), state);
    });
    (0, _defineProperty2.default)(this, "get", request => {
      const key = (0, _router.ensureRawRequest)(request);
      const state = this.storage.get(key);
      const status = this.storage.has(key) ? AuthStatus.authenticated : this.canBeAuthenticated() ? AuthStatus.unauthenticated : AuthStatus.unknown;
      return {
        status,
        state
      };
    });
    (0, _defineProperty2.default)(this, "isAuthenticated", request => {
      return this.get(request).status === AuthStatus.authenticated;
    });
    this.canBeAuthenticated = canBeAuthenticated;
  }

}

exports.AuthStateStorage = AuthStateStorage;