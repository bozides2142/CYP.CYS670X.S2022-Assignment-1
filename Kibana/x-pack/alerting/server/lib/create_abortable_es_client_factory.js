"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAbortableEsClientFactory = createAbortableEsClientFactory;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function createAbortableEsClientFactory(opts) {
  const {
    scopedClusterClient,
    abortController
  } = opts;
  return {
    asInternalUser: {
      search: async (query, options) => {
        try {
          const searchOptions = options !== null && options !== void 0 ? options : {};
          return await scopedClusterClient.asInternalUser.search(query, { ...searchOptions,
            signal: abortController.signal
          });
        } catch (e) {
          if (abortController.signal.aborted) {
            throw new Error('Search has been aborted due to cancelled execution');
          }

          throw e;
        }
      }
    },
    asCurrentUser: {
      search: async (query, options) => {
        try {
          const searchOptions = options !== null && options !== void 0 ? options : {};
          return await scopedClusterClient.asCurrentUser.search(query, { ...searchOptions,
            signal: abortController.signal
          });
        } catch (e) {
          if (abortController.signal.aborted) {
            throw new Error('Search has been aborted due to cancelled execution');
          }

          throw e;
        }
      }
    }
  };
}