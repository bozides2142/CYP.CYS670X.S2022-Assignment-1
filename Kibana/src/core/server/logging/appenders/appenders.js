"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.appendersSchema = exports.Appenders = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _configSchema = require("@kbn/config-schema");

var _std = require("@kbn/std");

var _layouts = require("../layouts/layouts");

var _console_appender = require("./console/console_appender");

var _file_appender = require("./file/file_appender");

var _rewrite_appender = require("./rewrite/rewrite_appender");

var _rolling_file_appender = require("./rolling_file/rolling_file_appender");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Config schema for validting the shape of the `appenders` key in in {@link LoggerContextConfigType} or
 * {@link LoggingConfigType}.
 *
 * @public
 */
const appendersSchema = _configSchema.schema.oneOf([_console_appender.ConsoleAppender.configSchema, _file_appender.FileAppender.configSchema, _rewrite_appender.RewriteAppender.configSchema, _rolling_file_appender.RollingFileAppender.configSchema]);
/** @public */


exports.appendersSchema = appendersSchema;

/** @internal */
class Appenders {
  /**
   * Factory method that creates specific `Appender` instances based on the passed `config` parameter.
   * @param config Configuration specific to a particular `Appender` implementation.
   * @returns Fully constructed `Appender` instance.
   */
  static create(config) {
    switch (config.type) {
      case 'console':
        return new _console_appender.ConsoleAppender(_layouts.Layouts.create(config.layout));

      case 'file':
        return new _file_appender.FileAppender(_layouts.Layouts.create(config.layout), config.fileName);

      case 'rewrite':
        return new _rewrite_appender.RewriteAppender(config);

      case 'rolling-file':
        return new _rolling_file_appender.RollingFileAppender(config);

      default:
        return (0, _std.assertNever)(config);
    }
  }

}

exports.Appenders = Appenders;
(0, _defineProperty2.default)(Appenders, "configSchema", appendersSchema);