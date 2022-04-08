"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resetRetryState = exports.delayRetryState = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const delayRetryState = (state, errorMessage, maxRetryAttempts) => {
  if (state.retryCount >= maxRetryAttempts) {
    return { ...state,
      controlState: 'FATAL',
      reason: `Unable to complete the ${state.controlState} step after ${maxRetryAttempts} attempts, terminating.`
    };
  } else {
    const retryCount = state.retryCount + 1;
    const retryDelay = 1000 * Math.min(Math.pow(2, retryCount), 64); // 2s, 4s, 8s, 16s, 32s, 64s, 64s, 64s ...

    return { ...state,
      retryCount,
      retryDelay,
      logs: [...state.logs, {
        level: 'error',
        message: `Action failed with '${errorMessage}'. Retrying attempt ${retryCount} in ${retryDelay / 1000} seconds.`
      }]
    };
  }
};

exports.delayRetryState = delayRetryState;

const resetRetryState = state => {
  return { ...state,
    retryCount: 0,
    retryDelay: 0
  };
};

exports.resetRetryState = resetRetryState;