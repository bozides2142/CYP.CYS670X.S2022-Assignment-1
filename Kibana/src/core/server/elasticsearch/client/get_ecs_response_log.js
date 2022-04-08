"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEcsResponseLog = getEcsResponseLog;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const FORBIDDEN_HEADERS = ['authorization', 'cookie', 'set-cookie'];
const REDACTED_HEADER_TEXT = '[REDACTED]'; // We are excluding sensitive headers by default, until we have a log filtering mechanism.

function redactSensitiveHeaders(key, value) {
  return FORBIDDEN_HEADERS.includes(key) ? REDACTED_HEADER_TEXT : value;
} // Shallow clone the headers so they are not mutated if filtered by a RewriteAppender.


function cloneAndFilterHeaders(headers) {
  const result = {};

  if (headers) {
    for (const key of Object.keys(headers)) {
      const value = headers[key];

      if (value) {
        result[key] = redactSensitiveHeaders(key, value);
      }
    }
  }

  return result;
}
/**
 * Retruns ECS-compliant `LogMeta` for logging.
 *
 * @internal
 */


function getEcsResponseLog(event, bytes) {
  const meta = {
    http: {
      request: {
        id: event.meta.request.options.opaqueId,
        method: event.meta.request.params.method.toUpperCase(),
        // @ts-expect-error ECS custom field: https://github.com/elastic/ecs/issues/232.
        headers: cloneAndFilterHeaders(event.meta.request.params.headers)
      },
      response: {
        body: {
          bytes
        },
        status_code: event.statusCode,
        // @ts-expect-error ECS custom field: https://github.com/elastic/ecs/issues/232.
        headers: cloneAndFilterHeaders(event.headers)
      }
    },
    url: {
      path: event.meta.request.params.path,
      query: event.meta.request.params.querystring
    }
  };
  return meta;
}