"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExecutionContract = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * `ExecutionContract` is a wrapper around `Execution` class. It provides the
 * same functionality but does not expose Expressions plugin internals.
 */
class ExecutionContract {
  get isPending() {
    const state = this.execution.state.get().state;
    const finished = state === 'error' || state === 'result';
    return !finished;
  }

  constructor(execution) {
    (0, _defineProperty2.default)(this, "execution", void 0);
    (0, _defineProperty2.default)(this, "cancel", () => {
      this.execution.cancel();
    });
    (0, _defineProperty2.default)(this, "getData", () => {
      return this.execution.result.pipe((0, _operators.catchError)(({
        name,
        message,
        stack
      }) => (0, _rxjs.of)({
        partial: false,
        result: {
          type: 'error',
          error: {
            name,
            message,
            stack
          }
        }
      })));
    });
    (0, _defineProperty2.default)(this, "getExpression", () => {
      return this.execution.expression;
    });
    (0, _defineProperty2.default)(this, "getAst", () => this.execution.state.get().ast);
    (0, _defineProperty2.default)(this, "inspect", () => this.execution.inspectorAdapters);
    this.execution = execution;
  }
  /**
   * Cancel the execution of the expression. This will set abort signal
   * (available in execution context) to aborted state, letting expression
   * functions to stop their execution.
   */


}

exports.ExecutionContract = ExecutionContract;