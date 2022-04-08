"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extendedBoundsToAst = void 0;

var _common = require("../../../../expressions/common");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const extendedBoundsToAst = extendedBounds => {
  return (0, _common.buildExpression)([(0, _common.buildExpressionFunction)('extendedBounds', extendedBounds)]).toAst();
};

exports.extendedBoundsToAst = extendedBoundsToAst;