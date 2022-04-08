"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nonAlphaNumRE = exports.allDoubleQuoteRE = exports.CSV_FORMULA_CHARS = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const CSV_FORMULA_CHARS = ['=', '+', '-', '@'];
exports.CSV_FORMULA_CHARS = CSV_FORMULA_CHARS;
const nonAlphaNumRE = /[^a-zA-Z0-9]/;
exports.nonAlphaNumRE = nonAlphaNumRE;
const allDoubleQuoteRE = /"/g;
exports.allDoubleQuoteRE = allDoubleQuoteRE;