"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OptionedParamType = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _base = require("./base");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class OptionedParamType extends _base.BaseParamType {
  constructor(config) {
    super(config);
    (0, _defineProperty2.default)(this, "options", void 0);

    if (!config.write) {
      this.write = (aggConfig, output) => {
        output.params[this.name] = aggConfig.params[this.name].value;
      };
    }

    if (!config.serialize) {
      this.serialize = selected => {
        return selected.value;
      };
    }

    if (!config.deserialize) {
      this.deserialize = value => {
        return this.options.find(option => option.value === value);
      };
    }

    this.options = config.options || [];
  }

}

exports.OptionedParamType = OptionedParamType;