"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toAsyncKibanaSearchResponse = toAsyncKibanaSearchResponse;

var _es_search = require("../es_search");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Get the Kibana representation of an async search response (see `IKibanaSearchResponse`).
 */
function toAsyncKibanaSearchResponse(response, warning) {
  return {
    id: response.id,
    rawResponse: response.response,
    isPartial: response.is_partial,
    isRunning: response.is_running,
    ...(warning ? {
      warning
    } : {}),
    ...(0, _es_search.getTotalLoaded)(response.response)
  };
}