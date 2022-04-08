"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExpressionsService = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _executor2 = require("../executor");

var _expression_renderers = require("../expression_renderers");

var _expression_functions = require("../expression_functions");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
// eslint-disable-next-line @kbn/eslint/no-restricted-paths

/**
 * `ExpressionsService` class is used for multiple purposes:
 *
 * 1. It implements the same Expressions service that can be used on both:
 *    (1) server-side and (2) browser-side.
 * 2. It implements the same Expressions service that users can fork/clone,
 *    thus have their own instance of the Expressions plugin.
 * 3. `ExpressionsService` defines the public contracts of *setup* and *start*
 *    Kibana Platform life-cycles for ease-of-use on server-side and browser-side.
 * 4. `ExpressionsService` creates a bound version of all exported contract functions.
 * 5. Functions are bound the way there are:
 *
 *    ```ts
 *    registerFunction = (...args: Parameters<Executor['registerFunction']>
 *      ): ReturnType<Executor['registerFunction']> => this.executor.registerFunction(...args);
 *    ```
 *
 *    so that JSDoc appears in developers IDE when they use those `plugins.expressions.registerFunction(`.
 */
class ExpressionsService {
  /**
   * @note Workaround since the expressions service is frozen.
   */
  constructor({
    executor: _executor = _executor2.Executor.createWithDefaults(),
    renderers: _renderers = new _expression_renderers.ExpressionRendererRegistry()
  } = {}) {
    (0, _defineProperty2.default)(this, "children", new Map());
    (0, _defineProperty2.default)(this, "parent", void 0);
    (0, _defineProperty2.default)(this, "executor", void 0);
    (0, _defineProperty2.default)(this, "renderers", void 0);
    (0, _defineProperty2.default)(this, "getFunction", name => this.executor.getFunction(name));
    (0, _defineProperty2.default)(this, "getFunctions", () => this.executor.getFunctions());
    (0, _defineProperty2.default)(this, "getRenderer", name => {
      this.assertStart();
      return this.renderers.get(name);
    });
    (0, _defineProperty2.default)(this, "getRenderers", () => {
      this.assertStart();
      return this.renderers.toJS();
    });
    (0, _defineProperty2.default)(this, "getType", name => {
      this.assertStart();
      return this.executor.getType(name);
    });
    (0, _defineProperty2.default)(this, "getTypes", () => this.executor.getTypes());
    (0, _defineProperty2.default)(this, "registerFunction", functionDefinition => this.executor.registerFunction(functionDefinition));
    (0, _defineProperty2.default)(this, "registerType", typeDefinition => this.executor.registerType(typeDefinition));
    (0, _defineProperty2.default)(this, "registerRenderer", definition => this.renderers.register(definition));
    (0, _defineProperty2.default)(this, "fork", name => {
      this.assertSetup();
      const executor = this.executor.fork();
      const renderers = this.renderers;
      const fork = new this.constructor({
        executor,
        renderers
      });
      fork.parent = this;

      if (name) {
        this.children.set(name, fork);
      }

      return fork;
    });
    (0, _defineProperty2.default)(this, "execute", (ast, input, params) => {
      this.assertStart();
      const execution = this.executor.createExecution(ast, params);
      execution.start(input);
      return execution.contract;
    });
    (0, _defineProperty2.default)(this, "run", (ast, input, params) => {
      this.assertStart();
      return this.executor.run(ast, input, params);
    });
    (0, _defineProperty2.default)(this, "telemetry", (state, telemetryData = {}) => {
      return this.executor.telemetry(state, telemetryData);
    });
    (0, _defineProperty2.default)(this, "extract", state => {
      return this.executor.extract(state);
    });
    (0, _defineProperty2.default)(this, "inject", (state, references) => {
      return this.executor.inject(state, references);
    });
    (0, _defineProperty2.default)(this, "getAllMigrations", () => {
      return this.executor.getAllMigrations();
    });
    (0, _defineProperty2.default)(this, "migrateToLatest", state => {
      return this.executor.migrateToLatest(state);
    });
    this.executor = _executor;
    this.renderers = _renderers;
  }

  isStarted() {
    var _this$parent;

    return !!(ExpressionsService.started.has(this) || (_this$parent = this.parent) !== null && _this$parent !== void 0 && _this$parent.isStarted());
  }

  assertSetup() {
    if (this.isStarted()) {
      throw new Error('The expression service is already started and can no longer be configured.');
    }
  }

  assertStart() {
    if (!this.isStarted()) {
      throw new Error('The expressions service has not started yet.');
    }
  }

  /**
   * Returns Kibana Platform *setup* life-cycle contract. Useful to return the
   * same contract on server-side and browser-side.
   */
  setup(...args) {
    for (const fn of [_expression_functions.clog, _expression_functions.createTable, _expression_functions.font, _expression_functions.variableSet, _expression_functions.variable, _expression_functions.theme, _expression_functions.cumulativeSum, _expression_functions.derivative, _expression_functions.movingAverage, _expression_functions.overallMetric, _expression_functions.mapColumn, _expression_functions.math, _expression_functions.mathColumn]) {
      this.registerFunction(fn);
    }

    return this;
  }
  /**
   * Returns Kibana Platform *start* life-cycle contract. Useful to return the
   * same contract on server-side and browser-side.
   */


  start(...args) {
    ExpressionsService.started.add(this);
    return this;
  }

  stop() {
    ExpressionsService.started.delete(this);
  }

}

exports.ExpressionsService = ExpressionsService;
(0, _defineProperty2.default)(ExpressionsService, "started", new WeakSet());