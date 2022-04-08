"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Execution = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _i18n = require("@kbn/i18n");

var _std = require("@kbn/std");

var _lodash = require("lodash");

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _container = require("./container");

var _util = require("../util");

var _common = require("../../../kibana_utils/common");

var _error = require("../expression_types/specs/error");

var _ast = require("../ast");

var _expression_types = require("../expression_types");

var _get_by_alias = require("../util/get_by_alias");

var _execution_contract = require("./execution_contract");

var _create_default_inspector_adapters = require("../util/create_default_inspector_adapters");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const createAbortErrorValue = () => (0, _util.createError)({
  message: 'The expression was aborted.',
  name: 'AbortError'
});

function markPartial() {
  return source => new _rxjs.Observable(subscriber => {
    let latest;
    subscriber.add(source.subscribe({
      next: result => {
        latest = {
          result,
          partial: true
        };
        subscriber.next(latest);
      },
      error: error => subscriber.error(error),
      complete: () => {
        if (latest) {
          latest.partial = false;
        }

        subscriber.complete();
      }
    }));
    subscriber.add(() => {
      latest = undefined;
    });
  });
}

function takeUntilAborted(signal) {
  return source => new _rxjs.Observable(subscriber => {
    const throwAbortError = () => {
      subscriber.error(new _common.AbortError());
    };

    subscriber.add(source.subscribe(subscriber));
    subscriber.add(() => signal.removeEventListener('abort', throwAbortError));
    signal.addEventListener('abort', throwAbortError);

    if (signal.aborted) {
      throwAbortError();
    }
  });
}

class Execution {
  /**
   * Dynamic state of the execution.
   */

  /**
   * Initial input of the execution.
   *
   * N.B. It is initialized to `null` rather than `undefined` for legacy reasons,
   * because in legacy interpreter it was set to `null` by default.
   */

  /**
   * Input of the started execution.
   */

  /**
   * Execution context - object that allows to do side-effects. Context is passed
   * to every function.
   */

  /**
   * AbortController to cancel this Execution.
   */

  /**
   * Whether .start() method has been called.
   */

  /**
   * Future that tracks result or error of this execution.
   */

  /**
   * Keeping track of any child executions
   * Needed to cancel child executions in case parent execution is canceled
   * @private
   */

  /**
   * Contract is a public representation of `Execution` instances. Contract we
   * can return to other plugins for their consumption.
   */
  get inspectorAdapters() {
    return this.context.inspectorAdapters;
  }

  constructor(execution) {
    (0, _defineProperty2.default)(this, "state", void 0);
    (0, _defineProperty2.default)(this, "input", null);
    (0, _defineProperty2.default)(this, "input$", new _rxjs.ReplaySubject(1));
    (0, _defineProperty2.default)(this, "context", void 0);
    (0, _defineProperty2.default)(this, "abortController", new AbortController());
    (0, _defineProperty2.default)(this, "hasStarted", false);
    (0, _defineProperty2.default)(this, "result", void 0);
    (0, _defineProperty2.default)(this, "childExecutions", []);
    (0, _defineProperty2.default)(this, "contract", void 0);
    (0, _defineProperty2.default)(this, "expression", void 0);
    this.execution = execution;
    const {
      executor
    } = execution;
    this.contract = new _execution_contract.ExecutionContract(this);

    if (!execution.ast && !execution.expression) {
      throw new TypeError('Execution params should contain at least .ast or .expression key.');
    } else if (execution.ast && execution.expression) {
      throw new TypeError('Execution params cannot contain both .ast and .expression key.');
    }

    this.expression = execution.expression || (0, _ast.formatExpression)(execution.ast);
    const ast = execution.ast || (0, _ast.parseExpression)(this.expression);
    this.state = (0, _container.createExecutionContainer)({ ...executor.state,
      state: 'not-started',
      ast
    });
    const inspectorAdapters = execution.params.inspectorAdapters || (0, _create_default_inspector_adapters.createDefaultInspectorAdapters)();
    this.context = {
      getSearchContext: () => this.execution.params.searchContext || {},
      getSearchSessionId: () => execution.params.searchSessionId,
      getKibanaRequest: execution.params.kibanaRequest ? () => execution.params.kibanaRequest : undefined,
      variables: execution.params.variables || {},
      types: executor.getTypes(),
      abortSignal: this.abortController.signal,
      inspectorAdapters,
      logDatatable: (name, datatable) => {
        inspectorAdapters.tables[name] = datatable;
      },
      isSyncColorsEnabled: () => execution.params.syncColors,
      ...execution.executor.context,
      getExecutionContext: () => execution.params.executionContext
    };
    this.result = this.input$.pipe((0, _operators.switchMap)(input => this.invokeChain(this.state.get().ast.chain, input).pipe(takeUntilAborted(this.abortController.signal), markPartial())), (0, _operators.catchError)(error => {
      if (this.abortController.signal.aborted) {
        this.childExecutions.forEach(childExecution => childExecution.cancel());
        return (0, _rxjs.of)({
          result: createAbortErrorValue(),
          partial: false
        });
      }

      return (0, _rxjs.throwError)(error);
    }), (0, _operators.tap)({
      next: result => {
        var _this$context$inspect;

        (_this$context$inspect = this.context.inspectorAdapters.expression) === null || _this$context$inspect === void 0 ? void 0 : _this$context$inspect.logAST(this.state.get().ast);
        this.state.transitions.setResult(result);
      },
      error: error => this.state.transitions.setError(error)
    }), (0, _operators.shareReplay)(1));
  }
  /**
   * Stop execution of expression.
   */


  cancel() {
    this.abortController.abort();
  }
  /**
   * Call this method to start execution.
   *
   * N.B. `input` is initialized to `null` rather than `undefined` for legacy reasons,
   * because in legacy interpreter it was set to `null` by default.
   */


  start(input = null, isSubExpression) {
    if (this.hasStarted) throw new Error('Execution already started.');
    this.hasStarted = true;
    this.input = input;
    this.state.transitions.start();

    if (!isSubExpression) {
      var _this$context$inspect2;

      (_this$context$inspect2 = this.context.inspectorAdapters.requests) === null || _this$context$inspect2 === void 0 ? void 0 : _this$context$inspect2.reset();
    }

    if ((0, _rxjs.isObservable)(input)) {
      input.subscribe(this.input$);
    } else if ((0, _std.isPromise)(input)) {
      (0, _rxjs.from)(input).subscribe(this.input$);
    } else {
      (0, _rxjs.of)(input).subscribe(this.input$);
    }

    return this.result;
  }

  invokeChain(chainArr, input) {
    return (0, _rxjs.of)(input).pipe(...chainArr.map(link => (0, _operators.switchMap)(currentInput => {
      const {
        function: fnName,
        arguments: fnArgs
      } = link;
      const fn = (0, _get_by_alias.getByAlias)(this.state.get().functions, fnName);

      if (!fn) {
        throw (0, _util.createError)({
          name: 'fn not found',
          message: _i18n.i18n.translate('expressions.execution.functionNotFound', {
            defaultMessage: `Function {fnName} could not be found.`,
            values: {
              fnName
            }
          })
        });
      }

      if (fn.disabled) {
        throw (0, _util.createError)({
          name: 'fn is disabled',
          message: _i18n.i18n.translate('expressions.execution.functionDisabled', {
            defaultMessage: `Function {fnName} is disabled.`,
            values: {
              fnName
            }
          })
        });
      }

      if (this.execution.params.debug) {
        link.debug = {
          args: {},
          duration: 0,
          fn: fn.name,
          input: currentInput,
          success: true
        };
      }

      const timeStart = this.execution.params.debug ? (0, _common.now)() : 0; // `resolveArgs` returns an object because the arguments themselves might
      // actually have `then` or `subscribe` methods which would be treated as a `Promise`
      // or an `Observable` accordingly.

      return this.resolveArgs(fn, currentInput, fnArgs).pipe((0, _operators.tap)(args => this.execution.params.debug && Object.assign(link.debug, {
        args
      })), (0, _operators.switchMap)(args => this.invokeFunction(fn, currentInput, args)), (0, _operators.switchMap)(output => (0, _expression_types.getType)(output) === 'error' ? (0, _rxjs.throwError)(output) : (0, _rxjs.of)(output)), (0, _operators.tap)(output => this.execution.params.debug && Object.assign(link.debug, {
        output
      })), (0, _operators.catchError)(rawError => {
        const error = (0, _util.createError)(rawError);
        error.error.message = `[${fnName}] > ${error.error.message}`;

        if (this.execution.params.debug) {
          Object.assign(link.debug, {
            error,
            rawError,
            success: false
          });
        }

        return (0, _rxjs.throwError)(error);
      }), (0, _operators.finalize)(() => {
        if (this.execution.params.debug) {
          Object.assign(link.debug, {
            duration: (0, _common.now)() - timeStart
          });
        }
      }));
    })), (0, _operators.catchError)(error => (0, _rxjs.of)(error)));
  }

  invokeFunction(fn, input, args) {
    return (0, _rxjs.of)(input).pipe((0, _operators.map)(currentInput => this.cast(currentInput, fn.inputTypes)), (0, _operators.switchMap)(normalizedInput => (0, _rxjs.of)(fn.fn(normalizedInput, args, this.context))), (0, _operators.switchMap)(fnResult => (0, _rxjs.isObservable)(fnResult) ? fnResult : (0, _rxjs.from)((0, _std.isPromise)(fnResult) ? fnResult : [fnResult])), (0, _operators.map)(output => {
      // Validate that the function returned the type it said it would.
      // This isn't required, but it keeps function developers honest.
      const returnType = (0, _expression_types.getType)(output);
      const expectedType = fn.type;

      if (expectedType && returnType !== expectedType) {
        throw new Error(`Function '${fn.name}' should return '${expectedType}',` + ` actually returned '${returnType}'`);
      } // Validate the function output against the type definition's validate function.


      const type = this.context.types[fn.type];

      if (type && type.validate) {
        try {
          type.validate(output);
        } catch (e) {
          throw new Error(`Output of '${fn.name}' is not a valid type '${fn.type}': ${e}`);
        }
      }

      return output;
    }));
  }

  cast(value, toTypeNames) {
    // If you don't give us anything to cast to, you'll get your input back
    if (!(toTypeNames !== null && toTypeNames !== void 0 && toTypeNames.length)) {
      return value;
    } // No need to cast if node is already one of the valid types


    const fromTypeName = (0, _expression_types.getType)(value);

    if (toTypeNames.includes(fromTypeName)) {
      return value;
    }

    const {
      types
    } = this.state.get();
    const fromTypeDef = types[fromTypeName];

    for (const toTypeName of toTypeNames) {
      // First check if the current type can cast to this type
      if (fromTypeDef !== null && fromTypeDef !== void 0 && fromTypeDef.castsTo(toTypeName)) {
        return fromTypeDef.to(value, toTypeName, types);
      } // If that isn't possible, check if this type can cast from the current type


      const toTypeDef = types[toTypeName];

      if (toTypeDef !== null && toTypeDef !== void 0 && toTypeDef.castsFrom(fromTypeName)) {
        return toTypeDef.from(value, types);
      }
    }

    throw new Error(`Can not cast '${fromTypeName}' to any of '${toTypeNames.join(', ')}'`);
  } // Processes the multi-valued AST argument values into arguments that can be passed to the function


  resolveArgs(fnDef, input, argAsts) {
    return (0, _rxjs.defer)(() => {
      const {
        args: argDefs
      } = fnDef; // Use the non-alias name from the argument definition

      const dealiasedArgAsts = (0, _lodash.reduce)(argAsts, (acc, argAst, argName) => {
        const argDef = (0, _get_by_alias.getByAlias)(argDefs, argName);

        if (!argDef) {
          throw new Error(`Unknown argument '${argName}' passed to function '${fnDef.name}'`);
        }

        acc[argDef.name] = (acc[argDef.name] || []).concat(argAst);
        return acc;
      }, {}); // Check for missing required arguments.

      for (const {
        aliases,
        default: argDefault,
        name,
        required
      } of Object.values(argDefs)) {
        if (!(name in dealiasedArgAsts) && typeof argDefault !== 'undefined') {
          dealiasedArgAsts[name] = [(0, _ast.parse)(argDefault, 'argument')];
        }

        if (!required || name in dealiasedArgAsts) {
          continue;
        }

        if (!(aliases !== null && aliases !== void 0 && aliases.length)) {
          throw new Error(`${fnDef.name} requires an argument`);
        } // use an alias if _ is the missing arg


        const errorArg = name === '_' ? aliases[0] : name;
        throw new Error(`${fnDef.name} requires an "${errorArg}" argument`);
      } // Create the functions to resolve the argument ASTs into values
      // These are what are passed to the actual functions if you opt out of resolving


      const resolveArgFns = (0, _lodash.mapValues)(dealiasedArgAsts, (asts, argName) => asts.map(item => (subInput = input) => this.interpret(item, subInput).pipe((0, _operators.pluck)('result'), (0, _operators.map)(output => {
        if ((0, _error.isExpressionValueError)(output)) {
          throw output.error;
        }

        return this.cast(output, argDefs[argName].types);
      }))));
      const argNames = (0, _lodash.keys)(resolveArgFns);

      if (!argNames.length) {
        return (0, _rxjs.from)([{}]);
      }

      const resolvedArgValuesObservable = (0, _rxjs.combineLatest)(argNames.map(argName => {
        const interpretFns = resolveArgFns[argName]; // `combineLatest` does not emit a value on an empty collection
        // @see https://github.com/ReactiveX/RxSwift/issues/1879

        if (!interpretFns.length) {
          return (0, _rxjs.of)([]);
        }

        return argDefs[argName].resolve ? (0, _rxjs.combineLatest)(interpretFns.map(fn => fn())) : (0, _rxjs.of)(interpretFns);
      }));
      return resolvedArgValuesObservable.pipe((0, _operators.map)(resolvedArgValues => (0, _lodash.mapValues)( // Return an object here because the arguments themselves might actually have a 'then'
      // function which would be treated as a promise
      (0, _lodash.zipObject)(argNames, resolvedArgValues), // Just return the last unless the argument definition allows multiple
      (argValues, argName) => argDefs[argName].multi ? argValues : (0, _lodash.last)(argValues))));
    });
  }

  interpret(ast, input) {
    switch ((0, _expression_types.getType)(ast)) {
      case 'expression':
        const execution = this.execution.executor.createExecution(ast, { ...this.execution.params,
          variables: this.context.variables
        });
        this.childExecutions.push(execution);
        return execution.start(input, true);

      case 'string':
      case 'number':
      case 'null':
      case 'boolean':
        return (0, _rxjs.of)({
          result: ast,
          partial: false
        });

      default:
        return (0, _rxjs.throwError)(new Error(`Unknown AST object: ${JSON.stringify(ast)}`));
    }
  }

}

exports.Execution = Execution;