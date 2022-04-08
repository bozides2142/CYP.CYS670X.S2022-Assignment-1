"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TypesRegistry = exports.FunctionsRegistry = exports.Executor = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _lodash = require("lodash");

var _container = require("./container");

var _expression_functions = require("../expression_functions");

var _execution = require("../execution/execution");

var _expression_type = require("../expression_types/expression_type");

var _specs = require("../expression_types/specs");

var _util = require("../util");

var _common = require("../../../kibana_utils/common");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/* eslint-disable max-classes-per-file */
class TypesRegistry {
  constructor(executor) {
    this.executor = executor;
  }

  register(typeDefinition) {
    this.executor.registerType(typeDefinition);
  }

  get(id) {
    var _this$executor$getTyp;

    return (_this$executor$getTyp = this.executor.getType(id)) !== null && _this$executor$getTyp !== void 0 ? _this$executor$getTyp : null;
  }

  toJS() {
    return this.executor.getTypes();
  }

  toArray() {
    return Object.values(this.toJS());
  }

}

exports.TypesRegistry = TypesRegistry;

class FunctionsRegistry {
  constructor(executor) {
    this.executor = executor;
  }

  register(functionDefinition) {
    this.executor.registerFunction(functionDefinition);
  }

  get(id) {
    var _this$executor$getFun;

    return (_this$executor$getFun = this.executor.getFunction(id)) !== null && _this$executor$getFun !== void 0 ? _this$executor$getFun : null;
  }

  toJS() {
    return this.executor.getFunctions();
  }

  toArray() {
    return Object.values(this.toJS());
  }

}

exports.FunctionsRegistry = FunctionsRegistry;

class Executor {
  static createWithDefaults(state) {
    const executor = new Executor(state);

    for (const type of _specs.typeSpecs) executor.registerType(type);

    return executor;
  }

  constructor(state) {
    (0, _defineProperty2.default)(this, "container", void 0);
    (0, _defineProperty2.default)(this, "functions", void 0);
    (0, _defineProperty2.default)(this, "types", void 0);
    (0, _defineProperty2.default)(this, "parent", void 0);
    this.functions = new FunctionsRegistry(this);
    this.types = new TypesRegistry(this);
    this.container = (0, _container.createExecutorContainer)(state);
  }

  get state() {
    var _this$parent, _parent$types, _parent$functions, _parent$context;

    const parent = (_this$parent = this.parent) === null || _this$parent === void 0 ? void 0 : _this$parent.state;
    const state = this.container.get();
    return { ...(parent !== null && parent !== void 0 ? parent : {}),
      ...state,
      types: { ...((_parent$types = parent === null || parent === void 0 ? void 0 : parent.types) !== null && _parent$types !== void 0 ? _parent$types : {}),
        ...state.types
      },
      functions: { ...((_parent$functions = parent === null || parent === void 0 ? void 0 : parent.functions) !== null && _parent$functions !== void 0 ? _parent$functions : {}),
        ...state.functions
      },
      context: { ...((_parent$context = parent === null || parent === void 0 ? void 0 : parent.context) !== null && _parent$context !== void 0 ? _parent$context : {}),
        ...state.context
      }
    };
  }

  registerFunction(functionDefinition) {
    const fn = new _expression_functions.ExpressionFunction(typeof functionDefinition === 'object' ? functionDefinition : functionDefinition());
    this.container.transitions.addFunction(fn);
  }

  getFunction(name) {
    var _this$container$get$f, _this$parent2;

    return (_this$container$get$f = this.container.get().functions[name]) !== null && _this$container$get$f !== void 0 ? _this$container$get$f : (_this$parent2 = this.parent) === null || _this$parent2 === void 0 ? void 0 : _this$parent2.getFunction(name);
  }

  getFunctions() {
    var _this$parent$getFunct, _this$parent3;

    return { ...((_this$parent$getFunct = (_this$parent3 = this.parent) === null || _this$parent3 === void 0 ? void 0 : _this$parent3.getFunctions()) !== null && _this$parent$getFunct !== void 0 ? _this$parent$getFunct : {}),
      ...this.container.get().functions
    };
  }

  registerType(typeDefinition) {
    const type = new _expression_type.ExpressionType(typeof typeDefinition === 'object' ? typeDefinition : typeDefinition());
    this.container.transitions.addType(type);
  }

  getType(name) {
    var _this$container$get$t, _this$parent4;

    return (_this$container$get$t = this.container.get().types[name]) !== null && _this$container$get$t !== void 0 ? _this$container$get$t : (_this$parent4 = this.parent) === null || _this$parent4 === void 0 ? void 0 : _this$parent4.getType(name);
  }

  getTypes() {
    var _this$parent$getTypes, _this$parent5;

    return { ...((_this$parent$getTypes = (_this$parent5 = this.parent) === null || _this$parent5 === void 0 ? void 0 : _this$parent5.getTypes()) !== null && _this$parent$getTypes !== void 0 ? _this$parent$getTypes : {}),
      ...this.container.get().types
    };
  }

  get context() {
    var _this$parent$context, _this$parent6;

    return { ...((_this$parent$context = (_this$parent6 = this.parent) === null || _this$parent6 === void 0 ? void 0 : _this$parent6.context) !== null && _this$parent$context !== void 0 ? _this$parent$context : {}),
      ...this.container.selectors.getContext()
    };
  }
  /**
   * Execute expression and return result.
   *
   * @param ast Expression AST or a string representing expression.
   * @param input Initial input to the first expression function.
   * @param context Extra global context object that will be merged into the
   *    expression global context object that is provided to each function to allow side-effects.
   */


  run(ast, input, params = {}) {
    return this.createExecution(ast, params).start(input);
  }

  createExecution(ast, params = {}) {
    const executionParams = {
      params,
      executor: this
    };
    if (typeof ast === 'string') executionParams.expression = ast;else executionParams.ast = ast;
    const execution = new _execution.Execution(executionParams);
    return execution;
  }

  walkAst(ast, action) {
    for (const link of ast.chain) {
      const {
        function: fnName,
        arguments: fnArgs
      } = link;
      const fn = (0, _util.getByAlias)(this.getFunctions(), fnName);

      if (fn) {
        // if any of arguments are expressions we should migrate those first
        link.arguments = (0, _lodash.mapValues)(fnArgs, asts => asts.map(arg => arg != null && typeof arg === 'object' ? this.walkAst(arg, action) : arg));
        action(fn, link);
      }
    }

    return ast;
  }

  walkAstAndTransform(ast, transform) {
    var _ast$chain$reduce;

    let additionalFunctions = 0;
    return (_ast$chain$reduce = ast.chain.reduce((newAst, funcAst, index) => {
      const realIndex = index + additionalFunctions;
      const {
        function: fnName,
        arguments: fnArgs
      } = funcAst;
      const fn = (0, _util.getByAlias)(this.getFunctions(), fnName);

      if (!fn) {
        return newAst;
      } // if any of arguments are expressions we should migrate those first


      funcAst.arguments = (0, _lodash.mapValues)(fnArgs, asts => asts.map(arg => arg != null && typeof arg === 'object' ? this.walkAstAndTransform(arg, transform) : arg));
      const transformedFn = transform(fn, funcAst);

      if (transformedFn.type === 'function') {
        const prevChain = realIndex > 0 ? newAst.chain.slice(0, realIndex) : [];
        const nextChain = newAst.chain.slice(realIndex + 1);
        return { ...newAst,
          chain: [...prevChain, transformedFn, ...nextChain]
        };
      }

      if (transformedFn.type === 'expression') {
        const {
          chain
        } = transformedFn;
        const prevChain = realIndex > 0 ? newAst.chain.slice(0, realIndex) : [];
        const nextChain = newAst.chain.slice(realIndex + 1);
        additionalFunctions += chain.length - 1;
        return { ...newAst,
          chain: [...prevChain, ...chain, ...nextChain]
        };
      }

      return newAst;
    }, ast)) !== null && _ast$chain$reduce !== void 0 ? _ast$chain$reduce : ast;
  }

  inject(ast, references) {
    let linkId = 0;
    return this.walkAst((0, _lodash.cloneDeep)(ast), (fn, link) => {
      link.arguments = fn.inject(link.arguments, references.filter(r => r.name.includes(`l${linkId}_`)).map(r => ({ ...r,
        name: r.name.replace(`l${linkId}_`, '')
      })));
      linkId++;
    });
  }

  extract(ast) {
    let linkId = 0;
    const allReferences = [];
    const newAst = this.walkAst((0, _lodash.cloneDeep)(ast), (fn, link) => {
      const {
        state,
        references
      } = fn.extract(link.arguments);
      link.arguments = state;
      allReferences.push(...references.map(r => ({ ...r,
        name: `l${linkId}_${r.name}`
      })));
      linkId = linkId + 1;
    });
    return {
      state: newAst,
      references: allReferences
    };
  }

  telemetry(ast, telemetryData) {
    this.walkAst((0, _lodash.cloneDeep)(ast), (fn, link) => {
      telemetryData = fn.telemetry(link.arguments, telemetryData);
    });
    return telemetryData;
  }

  getAllMigrations() {
    const uniqueVersions = new Set(Object.values(this.getFunctions()).map(fn => Object.keys(fn.migrations)).flat(1));
    const migrations = {};
    uniqueVersions.forEach(version => {
      migrations[version] = state => ({ ...this.migrate(state, version)
      });
    });
    return migrations;
  }

  migrateToLatest(state) {
    return (0, _common.migrateToLatest)(this.getAllMigrations(), state);
  }

  migrate(ast, version) {
    return this.walkAstAndTransform((0, _lodash.cloneDeep)(ast), (fn, link) => {
      const migrations = typeof fn.migrations === 'function' ? fn.migrations() : fn.migrations || {};

      if (!migrations[version]) {
        return link;
      }

      return migrations[version](link);
    });
  }

  fork() {
    const fork = new Executor();
    fork.parent = this;
    return fork;
  }

}

exports.Executor = Executor;