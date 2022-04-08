"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerTaskDefinition = registerTaskDefinition;

var _constants = require("./constants");

var _task_runner = require("./task_runner");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerTaskDefinition(taskManager, taskRunnerOpts) {
  taskManager.registerTaskDefinitions({
    [_constants.TASK_TYPE]: {
      title: 'Cleanup failed action executions',
      createTaskRunner: (0, _task_runner.taskRunner)(taskRunnerOpts)
    }
  });
}