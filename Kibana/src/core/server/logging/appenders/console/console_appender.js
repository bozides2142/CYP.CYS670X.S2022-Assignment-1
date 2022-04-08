"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConsoleAppender = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _configSchema = require("@kbn/config-schema");

var _layouts = require("../../layouts/layouts");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const {
  literal,
  object
} = _configSchema.schema;

/**
 *
 * Appender that formats all the `LogRecord` instances it receives and logs them via built-in `console`.
 * @internal
 */
class ConsoleAppender {
  /**
   * Creates ConsoleAppender instance.
   * @param layout Instance of `Layout` sub-class responsible for `LogRecord` formatting.
   */
  constructor(layout) {
    this.layout = layout;
  }
  /**
   * Formats specified `record` and logs it via built-in `console`.
   * @param record `LogRecord` instance to be logged.
   */


  append(record) {
    // eslint-disable-next-line no-console
    console.log(this.layout.format(record));
  }
  /**
   * Disposes `ConsoleAppender`.
   */


  dispose() {// noop
  }

}

exports.ConsoleAppender = ConsoleAppender;
(0, _defineProperty2.default)(ConsoleAppender, "configSchema", object({
  type: literal('console'),
  layout: _layouts.Layouts.configSchema
}));