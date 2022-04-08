"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.byTypeSchema = exports.byServiceProviderTypeSchema = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const byTypeSchema = {
  // TODO: Find out an automated way to populate the keys or reformat these into an array (and change the Remote Telemetry indexer accordingly)
  DYNAMIC_KEY: {
    type: 'long'
  },
  // Known actions:
  __email: {
    type: 'long'
  },
  __index: {
    type: 'long'
  },
  __pagerduty: {
    type: 'long'
  },
  __swimlane: {
    type: 'long'
  },
  '__server-log': {
    type: 'long'
  },
  __slack: {
    type: 'long'
  },
  __webhook: {
    type: 'long'
  },
  __servicenow: {
    type: 'long'
  },
  __jira: {
    type: 'long'
  },
  __resilient: {
    type: 'long'
  },
  __teams: {
    type: 'long'
  }
};
exports.byTypeSchema = byTypeSchema;
const byServiceProviderTypeSchema = {
  DYNAMIC_KEY: {
    type: 'long'
  },
  // Known services:
  exchange_server: {
    type: 'long'
  },
  gmail: {
    type: 'long'
  },
  outlook365: {
    type: 'long'
  },
  elastic_cloud: {
    type: 'long'
  },
  other: {
    type: 'long'
  },
  ses: {
    type: 'long'
  }
};
exports.byServiceProviderTypeSchema = byServiceProviderTypeSchema;