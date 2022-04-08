"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateExcludeFilters = void 0;

var _std = require("@kbn/std");

var Either = _interopRequireWildcard(require("fp-ts/lib/Either"));

var _catch_retryable_es_client_errors = require("./catch_retryable_es_client_errors");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const calculateExcludeFilters = ({
  client,
  excludeFromUpgradeFilterHooks,
  hookTimeoutMs = 30_000 // default to 30s, exposed for testing

}) => () => {
  return Promise.all(Object.entries(excludeFromUpgradeFilterHooks).map(([soType, hook]) => (0, _std.withTimeout)({
    promise: Promise.resolve(hook({
      readonlyEsClient: {
        search: client.search.bind(client)
      }
    })),
    timeoutMs: hookTimeoutMs
  }).then(result => result.timedout ? Either.left({
    soType,
    error: new Error(`excludeFromUpgrade hook timed out after ${hookTimeoutMs / 1000} seconds.`)
  }) : Either.right(result.value)).catch(error => {
    const retryableError = (0, _catch_retryable_es_client_errors.catchRetryableEsClientErrors)(error);

    if (Either.isLeft(retryableError)) {
      return Either.left({
        soType,
        error: retryableError.left
      });
    } else {
      // Really should never happen, only here to satisfy TypeScript
      return Either.left({
        soType,
        error: new Error(`Unexpected return value from catchRetryableEsClientErrors: "${retryableError.toString()}"`)
      });
    }
  }).catch(error => Either.left({
    soType,
    error
  })))).then(results => {
    const retryableError = results.find(r => Either.isLeft(r) && !(r.left.error instanceof Error) && r.left.error.type === 'retryable_es_client_error');

    if (retryableError) {
      return Either.left(retryableError.left.error);
    }

    const errorsByType = [];
    const filters = []; // Loop through all results and collect successes and errors

    results.forEach(r => Either.isRight(r) ? filters.push(r.right) : Either.isLeft(r) && errorsByType.push([r.left.soType, r.left.error])); // Composite filter from all calculated filters that successfully executed

    const excludeFilter = {
      bool: {
        must_not: filters
      }
    };
    return Either.right({
      excludeFilter,
      errorsByType: Object.fromEntries(errorsByType)
    });
  });
};

exports.calculateExcludeFilters = calculateExcludeFilters;