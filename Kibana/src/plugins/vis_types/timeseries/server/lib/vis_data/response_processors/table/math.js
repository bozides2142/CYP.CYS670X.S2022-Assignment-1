"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.math = void 0;

var _math = require("../series/math");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
// @ts-expect-error no typed yet
const math = ({
  response,
  panel,
  series,
  meta,
  extractFields
}) => next => results => {
  const mathFn = (0, _math.mathAgg)(response, panel, series, meta, extractFields);
  return mathFn(next)(results);
};

exports.math = math;