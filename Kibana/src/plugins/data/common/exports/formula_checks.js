"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tableHasFormulas = exports.cellHasFormulas = void 0;

var _lodash = require("lodash");

var _constants = require("./constants");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const cellHasFormulas = val => _constants.CSV_FORMULA_CHARS.some(formulaChar => (0, _lodash.startsWith)(val, formulaChar));

exports.cellHasFormulas = cellHasFormulas;

const tableHasFormulas = (columns, rows) => {
  return columns.some(({
    name
  }) => cellHasFormulas(name)) || rows.some(row => columns.some(({
    id
  }) => cellHasFormulas(row[id])));
};

exports.tableHasFormulas = tableHasFormulas;