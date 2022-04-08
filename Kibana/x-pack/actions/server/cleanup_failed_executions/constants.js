"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TASK_TYPE = exports.TASK_ID = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const TASK_TYPE = 'cleanup_failed_action_executions';
exports.TASK_TYPE = TASK_TYPE;
const TASK_ID = `Actions-${TASK_TYPE}`;
exports.TASK_ID = TASK_ID;