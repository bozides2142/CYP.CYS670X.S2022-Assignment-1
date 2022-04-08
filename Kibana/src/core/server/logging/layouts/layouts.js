"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Layouts = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _configSchema = require("@kbn/config-schema");

var _std = require("@kbn/std");

var _json_layout = require("./json_layout");

var _pattern_layout = require("./pattern_layout");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const {
  oneOf
} = _configSchema.schema;

/** @internal */
class Layouts {
  /**
   * Factory method that creates specific `Layout` instances based on the passed `config` parameter.
   * @param config Configuration specific to a particular `Layout` implementation.
   * @returns Fully constructed `Layout` instance.
   */
  static create(config) {
    switch (config.type) {
      case 'json':
        return new _json_layout.JsonLayout();

      case 'pattern':
        return new _pattern_layout.PatternLayout(config.pattern, config.highlight);

      default:
        return (0, _std.assertNever)(config);
    }
  }

}

exports.Layouts = Layouts;
(0, _defineProperty2.default)(Layouts, "configSchema", oneOf([_json_layout.JsonLayout.configSchema, _pattern_layout.PatternLayout.configSchema]));