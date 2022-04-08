"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EVENT_LOG_PROVIDER = exports.EVENT_LOG_ACTIONS = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const EVENT_LOG_PROVIDER = 'actions';
exports.EVENT_LOG_PROVIDER = EVENT_LOG_PROVIDER;
const EVENT_LOG_ACTIONS = {
  execute: 'execute',
  executeStart: 'execute-start',
  executeViaHttp: 'execute-via-http',
  executeTimeout: 'execute-timeout'
};
exports.EVENT_LOG_ACTIONS = EVENT_LOG_ACTIONS;