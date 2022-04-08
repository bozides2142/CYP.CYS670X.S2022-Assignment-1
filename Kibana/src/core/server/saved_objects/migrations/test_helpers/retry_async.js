"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.retryAsync = retryAsync;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function delay(delayInMs) {
  return new Promise(resolve => setTimeout(resolve, delayInMs));
}

async function retryAsync(fn, options) {
  try {
    return await fn();
  } catch (e) {
    if (options.retryAttempts > 1) {
      await delay(options.retryDelayMs);
      return retryAsync(fn, {
        retryAttempts: options.retryAttempts - 1,
        retryDelayMs: options.retryDelayMs
      });
    } else {
      throw e;
    }
  }
}