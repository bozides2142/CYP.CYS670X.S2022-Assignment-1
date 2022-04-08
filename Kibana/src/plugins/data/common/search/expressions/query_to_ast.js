"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.queryToAst = void 0;

var _common = require("../../../../expressions/common");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const queryToAst = query => {
  if (query.language === 'kuery') {
    return (0, _common.buildExpression)([(0, _common.buildExpressionFunction)('kql', {
      q: query.query
    })]).toAst();
  }

  return (0, _common.buildExpression)([(0, _common.buildExpressionFunction)('lucene', {
    q: JSON.stringify(query.query)
  })]).toAst();
};

exports.queryToAst = queryToAst;