"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toolkit = exports.isRetryResult = exports.isNotHandledResult = exports.createInternalErrorHandler = void 0;

var _http = require("../../http");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/** @internal */
const toolkit = {
  notHandled: () => ({
    type: 'notHandled'
  }),
  retry: ({
    authHeaders
  }) => ({
    type: 'retry',
    authHeaders
  })
};
exports.toolkit = toolkit;

const notHandledInternalErrorHandler = () => toolkit.notHandled();
/**
 * Converts the public version of `UnauthorizedErrorHandler` to the internal one used by the ES client
 *
 * @internal
 */


const createInternalErrorHandler = ({
  getHandler,
  request,
  setAuthHeaders
}) => {
  // we don't want to support 401 retry for fake requests
  if (!(0, _http.isRealRequest)(request)) {
    return notHandledInternalErrorHandler;
  }

  return async error => {
    try {
      const handler = getHandler();

      if (!handler) {
        return toolkit.notHandled();
      }

      const result = await handler({
        request,
        error
      }, toolkit);

      if (isRetryResult(result)) {
        setAuthHeaders(request, result.authHeaders);
      }

      return result;
    } catch (e) {
      return toolkit.notHandled();
    }
  };
};

exports.createInternalErrorHandler = createInternalErrorHandler;

const isRetryResult = result => {
  return result.type === 'retry';
};

exports.isRetryResult = isRetryResult;

const isNotHandledResult = result => {
  return result.type === 'notHandled';
};

exports.isNotHandledResult = isNotHandledResult;