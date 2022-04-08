"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.queryFilterToAst = void 0;

var _common = require("../../../../expressions/common");

var _query_to_ast = require("./query_to_ast");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const queryFilterToAst = ({
  input,
  label
}) => {
  return (0, _common.buildExpression)([(0, _common.buildExpressionFunction)('queryFilter', {
    label,
    input: (0, _query_to_ast.queryToAst)(input)
  })]).toAst();
};

exports.queryFilterToAst = queryFilterToAst;