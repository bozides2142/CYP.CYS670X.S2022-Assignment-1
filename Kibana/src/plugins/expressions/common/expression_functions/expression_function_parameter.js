"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExpressionFunctionParameter = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class ExpressionFunctionParameter {
  constructor(name, arg) {
    (0, _defineProperty2.default)(this, "name", void 0);
    (0, _defineProperty2.default)(this, "required", void 0);
    (0, _defineProperty2.default)(this, "help", void 0);
    (0, _defineProperty2.default)(this, "types", void 0);
    (0, _defineProperty2.default)(this, "default", void 0);
    (0, _defineProperty2.default)(this, "aliases", void 0);
    (0, _defineProperty2.default)(this, "multi", void 0);
    (0, _defineProperty2.default)(this, "resolve", void 0);
    (0, _defineProperty2.default)(this, "options", void 0);
    const {
      required,
      help,
      types,
      aliases,
      multi,
      resolve,
      options
    } = arg;

    if (name === '_') {
      throw Error('Arg names must not be _. Use it in aliases instead.');
    }

    this.name = name;
    this.required = !!required;
    this.help = help || '';
    this.types = types || [];
    this.default = arg.default;
    this.aliases = aliases || [];
    this.multi = !!multi;
    this.resolve = resolve == null ? true : resolve;
    this.options = options || [];
  }

  accepts(type) {
    var _this$types;

    return !((_this$types = this.types) !== null && _this$types !== void 0 && _this$types.length) || this.types.includes(type);
  }

}

exports.ExpressionFunctionParameter = ExpressionFunctionParameter;