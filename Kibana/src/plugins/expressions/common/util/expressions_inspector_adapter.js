"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExpressionsInspectorAdapter = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _events = require("events");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class ExpressionsInspectorAdapter extends _events.EventEmitter {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "_ast", {});
  }

  logAST(ast) {
    this._ast = ast;
    this.emit('change', this._ast);
  }

  get ast() {
    return this._ast;
  }

}

exports.ExpressionsInspectorAdapter = ExpressionsInspectorAdapter;