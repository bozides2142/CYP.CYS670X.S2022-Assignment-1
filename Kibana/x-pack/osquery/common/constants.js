"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OSQUERY_INTEGRATION_NAME = exports.DEFAULT_MAX_TABLE_QUERY_SIZE = exports.DEFAULT_DARK_MODE = exports.BASE_PATH = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const DEFAULT_MAX_TABLE_QUERY_SIZE = 10000;
exports.DEFAULT_MAX_TABLE_QUERY_SIZE = DEFAULT_MAX_TABLE_QUERY_SIZE;
const DEFAULT_DARK_MODE = 'theme:darkMode';
exports.DEFAULT_DARK_MODE = DEFAULT_DARK_MODE;
const OSQUERY_INTEGRATION_NAME = 'osquery_manager';
exports.OSQUERY_INTEGRATION_NAME = OSQUERY_INTEGRATION_NAME;
const BASE_PATH = '/app/osquery';
exports.BASE_PATH = BASE_PATH;