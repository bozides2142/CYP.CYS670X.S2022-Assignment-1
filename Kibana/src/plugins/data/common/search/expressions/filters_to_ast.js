"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filtersToAst = void 0;

var _common = require("../../../../expressions/common");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const filtersToAst = filters => {
  return (Array.isArray(filters) ? filters : [filters]).map(filter => {
    const {
      meta,
      $state,
      query,
      ...restOfFilters
    } = filter;
    return (0, _common.buildExpression)([(0, _common.buildExpressionFunction)('kibanaFilter', {
      query: JSON.stringify(query || restOfFilters),
      negate: meta.negate,
      disabled: meta.disabled
    })]).toAst();
  });
};

exports.filtersToAst = filtersToAst;