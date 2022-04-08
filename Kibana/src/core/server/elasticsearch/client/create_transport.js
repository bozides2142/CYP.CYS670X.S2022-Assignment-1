"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTransport = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _elasticsearch = require("@elastic/elasticsearch");

var _errors = require("./errors");

var _retry_unauthorized = require("./retry_unauthorized");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const noop = () => undefined;

const createTransport = ({
  getExecutionContext = noop,
  getUnauthorizedErrorHandler
}) => {
  class KibanaTransport extends _elasticsearch.Transport {
    constructor(options) {
      const {
        headers = {},
        ...otherOptions
      } = options;
      super(otherOptions);
      (0, _defineProperty2.default)(this, "headers", {});
      this.headers = headers;
    }

    async request(params, options) {
      const opts = options ? { ...options
      } : {};
      const opaqueId = getExecutionContext();

      if (opaqueId && !opts.opaqueId) {
        // rewrites headers['x-opaque-id'] if it presents
        opts.opaqueId = opaqueId;
      } // Enforce the client to return TransportResult.
      // It's required for bwc with responses in 7.x version.


      if (opts.meta === undefined) {
        opts.meta = true;
      } // add stored headers to the options


      opts.headers = { ...this.headers,
        ...(options === null || options === void 0 ? void 0 : options.headers)
      };

      try {
        return await super.request(params, opts);
      } catch (e) {
        if ((0, _errors.isUnauthorizedError)(e)) {
          const unauthorizedErrorHandler = getUnauthorizedErrorHandler ? getUnauthorizedErrorHandler() : undefined;

          if (unauthorizedErrorHandler) {
            const result = await unauthorizedErrorHandler(e);

            if ((0, _retry_unauthorized.isRetryResult)(result)) {
              this.headers = { ...this.headers,
                ...result.authHeaders
              };
              const retryOpts = { ...opts
              };
              retryOpts.headers = { ...this.headers,
                ...(options === null || options === void 0 ? void 0 : options.headers)
              };
              return await super.request(params, retryOpts);
            }
          }
        }

        throw e;
      }
    }

  }

  return KibanaTransport;
};

exports.createTransport = createTransport;