"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getImportStateMapForRetries = getImportStateMapForRetries;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Assume that all objects exist in the `retries` map (due to filtering at the beginning of `resolveSavedObjectsImportErrors`).
 */
function getImportStateMapForRetries(params) {
  const {
    objects,
    retries,
    createNewCopies
  } = params;
  const retryMap = retries.reduce((acc, cur) => acc.set(`${cur.type}:${cur.id}`, cur), new Map());
  const importStateMap = new Map();
  objects.forEach(({
    type,
    id
  }) => {
    const retry = retryMap.get(`${type}:${id}`);

    if (!retry) {
      throw new Error(`Retry was expected for "${type}:${id}" but not found`);
    }

    const {
      destinationId
    } = retry;
    const omitOriginId = createNewCopies || Boolean(retry.createNewCopy);

    if (destinationId && destinationId !== id) {
      importStateMap.set(`${type}:${id}`, {
        destinationId,
        omitOriginId
      });
    }
  });
  return importStateMap;
}