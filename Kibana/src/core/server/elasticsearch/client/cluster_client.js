"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ClusterClient = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _http = require("../../http");

var _router = require("../../http/router");

var _configure_client = require("./configure_client");

var _scoped_cluster_client = require("./scoped_cluster_client");

var _default_headers = require("../default_headers");

var _retry_unauthorized = require("./retry_unauthorized");

var _create_transport = require("./create_transport");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const noop = () => undefined;
/**
 * Represents an Elasticsearch cluster API client created by the platform.
 * It allows to call API on behalf of the internal Kibana user and
 * the actual user that is derived from the request headers (via `asScoped(...)`).
 *
 * @public
 **/


/** @internal **/
class ClusterClient {
  constructor({
    config,
    logger,
    type,
    authHeaders,
    getExecutionContext = noop,
    getUnauthorizedErrorHandler = noop
  }) {
    (0, _defineProperty2.default)(this, "config", void 0);
    (0, _defineProperty2.default)(this, "authHeaders", void 0);
    (0, _defineProperty2.default)(this, "rootScopedClient", void 0);
    (0, _defineProperty2.default)(this, "getUnauthorizedErrorHandler", void 0);
    (0, _defineProperty2.default)(this, "getExecutionContext", void 0);
    (0, _defineProperty2.default)(this, "isClosed", false);
    (0, _defineProperty2.default)(this, "asInternalUser", void 0);
    (0, _defineProperty2.default)(this, "createInternalErrorHandlerAccessor", request => {
      if (!this.authHeaders) {
        return undefined;
      }

      return () => (0, _retry_unauthorized.createInternalErrorHandler)({
        request,
        getHandler: this.getUnauthorizedErrorHandler,
        setAuthHeaders: this.authHeaders.set
      });
    });
    this.config = config;
    this.authHeaders = authHeaders;
    this.getExecutionContext = getExecutionContext;
    this.getUnauthorizedErrorHandler = getUnauthorizedErrorHandler;
    this.asInternalUser = (0, _configure_client.configureClient)(config, {
      logger,
      type,
      getExecutionContext
    });
    this.rootScopedClient = (0, _configure_client.configureClient)(config, {
      logger,
      type,
      getExecutionContext,
      scoped: true
    });
  }

  asScoped(request) {
    const scopedHeaders = this.getScopedHeaders(request);
    const transportClass = (0, _create_transport.createTransport)({
      getExecutionContext: this.getExecutionContext,
      getUnauthorizedErrorHandler: this.createInternalErrorHandlerAccessor(request)
    });
    const scopedClient = this.rootScopedClient.child({
      headers: scopedHeaders,
      Transport: transportClass
    });
    return new _scoped_cluster_client.ScopedClusterClient(this.asInternalUser, scopedClient);
  }

  async close() {
    if (this.isClosed) {
      return;
    }

    this.isClosed = true;
    await Promise.all([this.asInternalUser.close(), this.rootScopedClient.close()]);
  }

  getScopedHeaders(request) {
    let scopedHeaders;

    if ((0, _http.isRealRequest)(request)) {
      var _ensureRawRequest$hea;

      const requestHeaders = (_ensureRawRequest$hea = (0, _router.ensureRawRequest)(request).headers) !== null && _ensureRawRequest$hea !== void 0 ? _ensureRawRequest$hea : {};
      const requestIdHeaders = (0, _http.isKibanaRequest)(request) ? {
        'x-opaque-id': request.id
      } : {};
      const authHeaders = this.authHeaders ? this.authHeaders.get(request) : {};
      scopedHeaders = { ...(0, _router.filterHeaders)(requestHeaders, this.config.requestHeadersWhitelist),
        ...requestIdHeaders,
        ...authHeaders
      };
    } else {
      var _request$headers;

      scopedHeaders = (0, _router.filterHeaders)((_request$headers = request === null || request === void 0 ? void 0 : request.headers) !== null && _request$headers !== void 0 ? _request$headers : {}, this.config.requestHeadersWhitelist);
    }

    return { ..._default_headers.DEFAULT_HEADERS,
      ...this.config.customHeaders,
      ...scopedHeaders
    };
  }

}

exports.ClusterClient = ClusterClient;