"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.patternSchema = exports.PatternLayout = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _configSchema = require("@kbn/config-schema");

var _conversions = require("./conversions");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Default pattern used by PatternLayout if it's not overridden in the configuration.
 */
const DEFAULT_PATTERN = `[%date][%level][%logger] %message`;

const patternSchema = _configSchema.schema.string({
  validate: string => {
    _conversions.DateConversion.validate(string);
  }
});

exports.patternSchema = patternSchema;

const patternLayoutSchema = _configSchema.schema.object({
  highlight: _configSchema.schema.maybe(_configSchema.schema.boolean()),
  type: _configSchema.schema.literal('pattern'),
  pattern: _configSchema.schema.maybe(patternSchema)
});

const conversions = [_conversions.LoggerConversion, _conversions.MessageConversion, _conversions.LevelConversion, _conversions.MetaConversion, _conversions.PidConversion, _conversions.DateConversion];
/** @internal */

/**
 * Layout that formats `LogRecord` using the `pattern` string with optional
 * color highlighting (eg. to make log messages easier to read in the terminal).
 * @internal
 */
class PatternLayout {
  constructor(pattern = DEFAULT_PATTERN, highlight = false) {
    this.pattern = pattern;
    this.highlight = highlight;
  }
  /**
   * Formats `LogRecord` into a string based on the specified `pattern` and `highlighting` options.
   * @param record Instance of `LogRecord` to format into string.
   */


  format(record) {
    let recordString = this.pattern;

    for (const conversion of conversions) {
      recordString = recordString.replace(conversion.pattern, conversion.convert.bind(null, record, this.highlight));
    }

    return recordString;
  }

}

exports.PatternLayout = PatternLayout;
(0, _defineProperty2.default)(PatternLayout, "configSchema", patternLayoutSchema);