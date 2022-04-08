"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.retryTransientEsErrors = void 0;

var _promises = require("timers/promises");

var _elasticsearch = require("@elastic/elasticsearch");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const MAX_ATTEMPTS = 5;
const retryResponseStatuses = [503, // ServiceUnavailable
408, // RequestTimeout
410 // Gone
];

const isRetryableError = e => e instanceof _elasticsearch.errors.NoLivingConnectionsError || e instanceof _elasticsearch.errors.ConnectionError || e instanceof _elasticsearch.errors.TimeoutError || e instanceof _elasticsearch.errors.ResponseError && retryResponseStatuses.includes(e === null || e === void 0 ? void 0 : e.statusCode);
/**
 * Retries any transient network or configuration issues encountered from Elasticsearch with an exponential backoff.
 * Should only be used to wrap operations that are idempotent and can be safely executed more than once.
 */


const retryTransientEsErrors = async (esCall, {
  logger,
  attempt = 0
} = {}) => {
  try {
    return await esCall();
  } catch (e) {
    if (attempt < MAX_ATTEMPTS && isRetryableError(e)) {
      const retryCount = attempt + 1;
      const retryDelaySec = Math.min(Math.pow(2, retryCount), 64); // 2s, 4s, 8s, 16s, 32s, 64s, 64s, 64s ...

      logger === null || logger === void 0 ? void 0 : logger.warn(`Retrying Elasticsearch operation after [${retryDelaySec}s] due to error: ${e.toString()} ${e.stack}`);
      await (0, _promises.setTimeout)(retryDelaySec * 1000);
      return retryTransientEsErrors(esCall, {
        logger,
        attempt: retryCount
      });
    }

    throw e;
  }
};

exports.retryTransientEsErrors = retryTransientEsErrors;