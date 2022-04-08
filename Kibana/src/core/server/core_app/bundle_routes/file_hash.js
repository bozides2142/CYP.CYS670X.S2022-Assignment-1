"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFileHash = getFileHash;

var _utils = require("./utils");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 *  Get the hash of a file via a file descriptor
 */
async function getFileHash(cache, path, stat, fd) {
  const key = (0, _utils.getFileCacheKey)(path, stat);
  const cached = cache.get(key);

  if (cached) {
    return await cached;
  }

  const promise = (0, _utils.generateFileHash)(fd).catch(error => {
    // don't cache failed attempts
    cache.del(key);
    throw error;
  });
  cache.set(key, promise);
  return await promise;
}