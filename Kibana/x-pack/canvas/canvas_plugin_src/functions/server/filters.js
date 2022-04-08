"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filters = void 0;

var _interpreter = require("@kbn/interpreter");

var _functions = require("../../../common/functions");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/* 
  Expression function `filters` can't be used on the server, because it is tightly coupled with the redux store. 
  It is replaced with `kibana | selectFilter`.
  
  Current filters function definition is used only for the purpose of enabling migrations.
  The function has to be registered on the server while the plugin's setup, to be able to run its migration.
*/


const filtersFn = () => ({
  type: 'filter',
  and: []
});

const migrations = {
  '8.1.0': ast => {
    const SELECT_FILTERS = 'selectFilter';
    const newExpression = `kibana | ${SELECT_FILTERS}`;
    const newAst = (0, _interpreter.fromExpression)(newExpression);
    const selectFiltersAstIndex = newAst.chain.findIndex(({
      function: fnName
    }) => fnName === SELECT_FILTERS);
    const selectFilterAst = newAst.chain[selectFiltersAstIndex];
    newAst.chain.splice(selectFiltersAstIndex, 1, { ...selectFilterAst,
      arguments: ast.arguments
    });
    return newAst;
  }
};
const filters = (0, _functions.buildFiltersFunction)(filtersFn, migrations);
exports.filters = filters;