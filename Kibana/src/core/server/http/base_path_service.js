"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BasePath = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _std = require("@kbn/std");

var _router = require("./router");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Access or manipulate the Kibana base path
 *
 * @public
 */
class BasePath {
  /**
   * returns the server's basePath
   *
   * See {@link BasePath.get} for getting the basePath value for a specific request
   */

  /**
   * The server's publicly exposed base URL, if configured. Includes protocol, host, port (optional) and the
   * {@link BasePath.serverBasePath}.
   *
   * @remarks
   * Should be used for generating external URL links back to this Kibana instance.
   */

  /** @internal */
  constructor(serverBasePath = '', publicBaseUrl) {
    (0, _defineProperty2.default)(this, "basePathCache", new WeakMap());
    (0, _defineProperty2.default)(this, "serverBasePath", void 0);
    (0, _defineProperty2.default)(this, "publicBaseUrl", void 0);
    (0, _defineProperty2.default)(this, "get", request => {
      const requestScopePath = this.basePathCache.get((0, _router.ensureRawRequest)(request)) || '';
      return `${this.serverBasePath}${requestScopePath}`;
    });
    (0, _defineProperty2.default)(this, "set", (request, requestSpecificBasePath) => {
      const rawRequest = (0, _router.ensureRawRequest)(request);

      if (this.basePathCache.has(rawRequest)) {
        throw new Error('Request basePath was previously set. Setting multiple times is not supported.');
      }

      this.basePathCache.set(rawRequest, requestSpecificBasePath);
    });
    (0, _defineProperty2.default)(this, "prepend", path => {
      if (this.serverBasePath === '') return path;
      return (0, _std.modifyUrl)(path, parts => {
        if (!parts.hostname && parts.pathname && parts.pathname.startsWith('/')) {
          parts.pathname = `${this.serverBasePath}${parts.pathname}`;
        }
      });
    });
    (0, _defineProperty2.default)(this, "remove", path => {
      if (this.serverBasePath === '') {
        return path;
      }

      if (path === this.serverBasePath) {
        return '/';
      }

      if (path.startsWith(`${this.serverBasePath}/`)) {
        return path.slice(this.serverBasePath.length);
      }

      return path;
    });
    this.serverBasePath = serverBasePath;
    this.publicBaseUrl = publicBaseUrl;
  }
  /**
   * returns `basePath` value, specific for an incoming request.
   */


}
/**
 * Access or manipulate the Kibana base path
 *
 * {@link BasePath}
 * @public
 */


exports.BasePath = BasePath;