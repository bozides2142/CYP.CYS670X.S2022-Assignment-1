"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BaseParamType = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class BaseParamType {
  constructor(config) {
    (0, _defineProperty2.default)(this, "name", void 0);
    (0, _defineProperty2.default)(this, "type", void 0);
    (0, _defineProperty2.default)(this, "displayName", void 0);
    (0, _defineProperty2.default)(this, "required", void 0);
    (0, _defineProperty2.default)(this, "advanced", void 0);
    (0, _defineProperty2.default)(this, "default", void 0);
    (0, _defineProperty2.default)(this, "write", void 0);
    (0, _defineProperty2.default)(this, "serialize", void 0);
    (0, _defineProperty2.default)(this, "deserialize", void 0);
    (0, _defineProperty2.default)(this, "toExpressionAst", void 0);
    (0, _defineProperty2.default)(this, "options", void 0);
    (0, _defineProperty2.default)(this, "valueType", void 0);
    (0, _defineProperty2.default)(this, "modifyAggConfigOnSearchRequestStart", void 0);
    this.name = config.name;
    this.type = config.type;
    this.displayName = config.displayName || this.name;
    this.required = config.required === true;
    this.advanced = config.advanced || false;
    this.onChange = config.onChange;
    this.shouldShow = config.shouldShow;
    this.default = config.default;

    const defaultWrite = (aggConfig, output) => {
      if (aggConfig.params[this.name]) {
        output.params[this.name] = aggConfig.params[this.name] || this.default;
      }
    };

    this.write = config.write || defaultWrite;
    this.serialize = config.serialize;
    this.deserialize = config.deserialize;
    this.toExpressionAst = config.toExpressionAst;
    this.options = config.options;

    this.modifyAggConfigOnSearchRequestStart = config.modifyAggConfigOnSearchRequestStart || function () {};

    this.valueType = config.valueType || config.type;
  }

}

exports.BaseParamType = BaseParamType;