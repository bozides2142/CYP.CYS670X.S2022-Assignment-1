"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExpressionsServerPlugin = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _lodash = require("lodash");

var _common = require("../common");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class ExpressionsServerPlugin {
  constructor(initializerContext) {
    (0, _defineProperty2.default)(this, "expressions", new _common.ExpressionsService());
  }

  setup(core) {
    const setup = this.expressions.setup((0, _lodash.pick)(core, 'getStartServices'));
    return Object.freeze(setup);
  }

  start(core) {
    const start = this.expressions.start();
    return Object.freeze(start);
  }

  stop() {
    this.expressions.stop();
  }

}

exports.ExpressionsServerPlugin = ExpressionsServerPlugin;