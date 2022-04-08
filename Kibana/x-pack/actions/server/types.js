"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isPersistedActionTask = isPersistedActionTask;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// the parameters passed to an action type executor function
// signature of the action type executor function

function isPersistedActionTask(actionTask) {
  return typeof actionTask.actionTaskParamsId === 'string';
}