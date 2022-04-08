"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExpressionType = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _get_type = require("./get_type");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class ExpressionType {
  /**
   * A short help text.
   */

  /**
   * Type validation, useful for checking function output.
   */

  /**
   * Optional serialization (used when passing context around client/server).
   */
  constructor(definition) {
    (0, _defineProperty2.default)(this, "name", void 0);
    (0, _defineProperty2.default)(this, "help", void 0);
    (0, _defineProperty2.default)(this, "validate", void 0);
    (0, _defineProperty2.default)(this, "create", void 0);
    (0, _defineProperty2.default)(this, "serialize", void 0);
    (0, _defineProperty2.default)(this, "deserialize", void 0);
    (0, _defineProperty2.default)(this, "definition", void 0);
    (0, _defineProperty2.default)(this, "getToFn", typeName => !this.definition.to ? undefined : this.definition.to[typeName] || this.definition.to['*']);
    (0, _defineProperty2.default)(this, "getFromFn", typeName => !this.definition.from ? undefined : this.definition.from[typeName] || this.definition.from['*']);
    (0, _defineProperty2.default)(this, "castsTo", value => typeof this.getToFn(value) === 'function');
    (0, _defineProperty2.default)(this, "castsFrom", value => typeof this.getFromFn(value) === 'function');
    (0, _defineProperty2.default)(this, "to", (value, toTypeName, types) => {
      const typeName = (0, _get_type.getType)(value);

      if (typeName !== this.name) {
        throw new Error(`Can not cast object of type '${typeName}' using '${this.name}'`);
      } else if (!this.castsTo(toTypeName)) {
        throw new Error(`Can not cast '${typeName}' to '${toTypeName}'`);
      }

      return this.getToFn(toTypeName)(value, types);
    });
    (0, _defineProperty2.default)(this, "from", (value, types) => {
      const typeName = (0, _get_type.getType)(value);

      if (!this.castsFrom(typeName)) {
        throw new Error(`Can not cast '${this.name}' from ${typeName}`);
      }

      return this.getFromFn(typeName)(value, types);
    });
    const {
      name,
      help,
      deserialize,
      serialize,
      validate
    } = definition;
    this.name = name;
    this.help = help || '';

    this.validate = validate || (() => {}); // Optional


    this.create = definition.create;
    this.serialize = serialize;
    this.deserialize = deserialize;
    this.definition = definition;
  }

}

exports.ExpressionType = ExpressionType;