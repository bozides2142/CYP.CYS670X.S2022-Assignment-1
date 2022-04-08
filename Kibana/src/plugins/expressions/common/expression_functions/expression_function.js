"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExpressionFunction = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _lodash = require("lodash");

var _expression_function_parameter = require("./expression_function_parameter");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class ExpressionFunction {
  /**
   * Name of function
   */

  /**
   * Aliases that can be used instead of `name`.
   */

  /**
   * Return type of function. This SHOULD be supplied. We use it for UI
   * and autocomplete hinting. We may also use it for optimizations in
   * the future.
   */

  /**
   * Function to run function (context, args)
   */

  /**
   * A short help text.
   */

  /**
   * Specification of expression function parameters.
   */

  /**
   * Type of inputs that this function supports.
   */
  constructor(functionDefinition) {
    (0, _defineProperty2.default)(this, "name", void 0);
    (0, _defineProperty2.default)(this, "aliases", void 0);
    (0, _defineProperty2.default)(this, "type", void 0);
    (0, _defineProperty2.default)(this, "fn", void 0);
    (0, _defineProperty2.default)(this, "help", void 0);
    (0, _defineProperty2.default)(this, "args", {});
    (0, _defineProperty2.default)(this, "inputTypes", void 0);
    (0, _defineProperty2.default)(this, "disabled", void 0);
    (0, _defineProperty2.default)(this, "telemetry", void 0);
    (0, _defineProperty2.default)(this, "extract", void 0);
    (0, _defineProperty2.default)(this, "inject", void 0);
    (0, _defineProperty2.default)(this, "migrations", void 0);
    (0, _defineProperty2.default)(this, "accepts", type => {
      var _this$inputTypes$incl, _this$inputTypes;

      // If you don't tell us input types, we'll assume you don't care what you get.
      return (_this$inputTypes$incl = (_this$inputTypes = this.inputTypes) === null || _this$inputTypes === void 0 ? void 0 : _this$inputTypes.includes(type)) !== null && _this$inputTypes$incl !== void 0 ? _this$inputTypes$incl : true;
    });
    const {
      name,
      type: _type,
      aliases,
      fn,
      help,
      args,
      inputTypes,
      context,
      disabled,
      telemetry,
      inject,
      extract,
      migrations
    } = functionDefinition;
    this.name = name;
    this.type = _type;
    this.aliases = aliases || [];
    this.fn = fn;
    this.help = help || '';
    this.inputTypes = inputTypes || (context === null || context === void 0 ? void 0 : context.types);
    this.disabled = disabled || false;

    this.telemetry = telemetry || ((s, c) => c);

    this.inject = inject || _lodash.identity;

    this.extract = extract || (s => ({
      state: s,
      references: []
    }));

    this.migrations = migrations || {};

    for (const [key, arg] of Object.entries(args || {})) {
      this.args[key] = new _expression_function_parameter.ExpressionFunctionParameter(key, arg);
    }
  }

}

exports.ExpressionFunction = ExpressionFunction;