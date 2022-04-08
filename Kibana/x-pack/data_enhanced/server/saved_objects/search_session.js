"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.searchSessionSavedObjectType = void 0;

var _common = require("../../../../../src/plugins/data/common");

var _search_session_migration = require("./search_session_migration");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const searchSessionSavedObjectType = {
  name: _common.SEARCH_SESSION_TYPE,
  namespaceType: 'single',
  hidden: true,
  mappings: {
    properties: {
      persisted: {
        type: 'boolean'
      },
      sessionId: {
        type: 'keyword'
      },
      name: {
        type: 'keyword'
      },
      created: {
        type: 'date'
      },
      expires: {
        type: 'date'
      },
      touched: {
        type: 'date'
      },
      completed: {
        type: 'date'
      },
      status: {
        type: 'keyword'
      },
      appId: {
        type: 'keyword'
      },
      locatorId: {
        type: 'keyword'
      },
      initialState: {
        type: 'object',
        enabled: false
      },
      restoreState: {
        type: 'object',
        enabled: false
      },
      idMapping: {
        type: 'object',
        enabled: false
      },
      realmType: {
        type: 'keyword'
      },
      realmName: {
        type: 'keyword'
      },
      username: {
        type: 'keyword'
      },
      version: {
        type: 'keyword'
      }
    }
  },
  migrations: _search_session_migration.searchSessionSavedObjectMigrations
};
exports.searchSessionSavedObjectType = searchSessionSavedObjectType;