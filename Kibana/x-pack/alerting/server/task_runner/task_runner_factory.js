"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TaskRunnerFactory = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _task_runner = require("./task_runner");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class TaskRunnerFactory {
  constructor() {
    (0, _defineProperty2.default)(this, "isInitialized", false);
    (0, _defineProperty2.default)(this, "taskRunnerContext", void 0);
  }

  initialize(taskRunnerContext) {
    if (this.isInitialized) {
      throw new Error('TaskRunnerFactory already initialized');
    }

    this.isInitialized = true;
    this.taskRunnerContext = taskRunnerContext;
  }

  create(ruleType, {
    taskInstance
  }) {
    if (!this.isInitialized) {
      throw new Error('TaskRunnerFactory not initialized');
    }

    return new _task_runner.TaskRunner(ruleType, taskInstance, this.taskRunnerContext);
  }

}

exports.TaskRunnerFactory = TaskRunnerFactory;