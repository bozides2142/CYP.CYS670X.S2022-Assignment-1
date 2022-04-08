"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExpressionShapePlugin = void 0;

var _expression_functions = require("../common/expression_functions");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class ExpressionShapePlugin {
  setup(core, {
    expressions
  }) {
    expressions.registerFunction(_expression_functions.shapeFunction);
    expressions.registerFunction(_expression_functions.progressFunction);
  }

  start(core) {}

  stop() {}

}

exports.ExpressionShapePlugin = ExpressionShapePlugin;