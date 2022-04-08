"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bulkDelete = bulkDelete;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function bulkDelete(esClient, index, ids) {
  if (ids.length === 0) {
    return;
  }

  return await esClient.bulk({
    body: ids.map(id => ({
      delete: {
        _index: index,
        _id: id
      }
    }))
  });
}