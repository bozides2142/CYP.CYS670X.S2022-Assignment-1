"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createCasesClientInternal = exports.CasesClientInternal = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _client = require("./configure/client");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class CasesClientInternal {
  constructor(args) {
    (0, _defineProperty2.default)(this, "_configuration", void 0);
    this._configuration = (0, _client.createInternalConfigurationSubClient)(args, this);
  }

  get configuration() {
    return this._configuration;
  }

}

exports.CasesClientInternal = CasesClientInternal;

const createCasesClientInternal = args => {
  return new CasesClientInternal(args);
};

exports.createCasesClientInternal = createCasesClientInternal;