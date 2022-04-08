"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createInternalESClient = createInternalESClient;

var _server = require("../../../../../../observability/server");

var _call_async_with_debug = require("../call_async_with_debug");

var _cancel_es_request_on_abort = require("../cancel_es_request_on_abort");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function createInternalESClient({
  context,
  debug,
  request
}) {
  const {
    asInternalUser
  } = context.core.elasticsearch.client;

  function callEs(operationName, {
    cb,
    requestType,
    params
  }) {
    return (0, _call_async_with_debug.callAsyncWithDebug)({
      cb: () => {
        const controller = new AbortController();
        return (0, _server.unwrapEsResponse)((0, _cancel_es_request_on_abort.cancelEsRequestOnAbort)(cb(controller.signal), request, controller));
      },
      getDebugMessage: () => ({
        title: (0, _call_async_with_debug.getDebugTitle)(request),
        body: (0, _call_async_with_debug.getDebugBody)({
          params,
          requestType,
          operationName
        })
      }),
      debug,
      isCalledWithInternalUser: true,
      request,
      requestType,
      requestParams: params,
      operationName
    });
  }

  return {
    search: async (operationName, params) => {
      return callEs(operationName, {
        requestType: 'search',
        cb: signal => asInternalUser.search(params, {
          signal
        }),
        params
      });
    },
    index: (operationName, params) => {
      return callEs(operationName, {
        requestType: 'index',
        cb: signal => asInternalUser.index(params, {
          signal
        }),
        params
      });
    },
    delete: (operationName, params) => {
      return callEs(operationName, {
        requestType: 'delete',
        cb: signal => asInternalUser.delete(params, {
          signal
        }),
        params
      });
    },
    indicesCreate: (operationName, params) => {
      return callEs(operationName, {
        requestType: 'indices.create',
        cb: signal => asInternalUser.indices.create(params, {
          signal
        }),
        params
      });
    }
  };
}