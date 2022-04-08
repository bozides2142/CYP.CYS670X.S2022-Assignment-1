"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMatchingIndexes = getMatchingIndexes;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getMatchingIndexes(indexPattern, {
  asCurrentUser
}, response, logger) {
  try {
    const {
      body: indexResults
    } = await asCurrentUser.cat.indices({
      index: indexPattern,
      format: 'JSON'
    });
    const matchingIndexes = indexResults.map(indexRecord => indexRecord.index).filter(indexName => !!indexName);
    return response.ok({
      body: {
        success: true,
        matchingIndexes: matchingIndexes
      }
    });
  } catch (error) {
    var _error$meta;

    const errorStatusCode = (_error$meta = error.meta) === null || _error$meta === void 0 ? void 0 : _error$meta.statusCode;

    if (errorStatusCode === 404) {
      return response.ok({
        body: {
          success: true,
          matchingIndexes: []
        }
      });
    } else {
      var _error$meta2, _error$meta2$body, _error$meta2$body$err;

      logger.error(error);
      return response.custom({
        body: {
          success: false,
          message: `Error accessing indexes: ${(_error$meta2 = error.meta) === null || _error$meta2 === void 0 ? void 0 : (_error$meta2$body = _error$meta2.body) === null || _error$meta2$body === void 0 ? void 0 : (_error$meta2$body$err = _error$meta2$body.error) === null || _error$meta2$body$err === void 0 ? void 0 : _error$meta2$body$err.type}`
        },
        statusCode: 200
      });
    }
  }
}