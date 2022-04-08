"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logError = logError;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function logError({
  id,
  context,
  error,
  docType,
  docKey
}) {
  context.log.error(`Failed to migrate ${docType} with doc id: ${id} version: ${context.migrationVersion} error: ${error.message}`, {
    migrations: {
      [docKey]: {
        id
      }
    }
  });
}