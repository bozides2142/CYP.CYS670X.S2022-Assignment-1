"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runResilientMigrator = runResilientMigrator;

var _next = require("./next");

var _model = require("./model");

var _initial_state = require("./initial_state");

var _migrations_state_action_machine = require("./migrations_state_action_machine");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Migrates the provided indexPrefix index using a resilient algorithm that is
 * completely lock-free so that any failure can always be retried by
 * restarting Kibana.
 */
async function runResilientMigrator({
  client,
  kibanaVersion,
  targetMappings,
  logger,
  preMigrationScript,
  transformRawDocs,
  migrationVersionPerType,
  indexPrefix,
  migrationsConfig,
  typeRegistry
}) {
  const initialState = (0, _initial_state.createInitialState)({
    kibanaVersion,
    targetMappings,
    preMigrationScript,
    migrationVersionPerType,
    indexPrefix,
    migrationsConfig,
    typeRegistry
  });
  return (0, _migrations_state_action_machine.migrationStateActionMachine)({
    initialState,
    logger,
    next: (0, _next.next)(client, transformRawDocs),
    model: _model.model,
    client
  });
}