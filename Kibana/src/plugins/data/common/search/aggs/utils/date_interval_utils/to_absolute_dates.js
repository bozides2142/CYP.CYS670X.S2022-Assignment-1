"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toAbsoluteDates = toAbsoluteDates;

var _datemath = _interopRequireDefault(require("@elastic/datemath"));

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function toAbsoluteDates(range) {
  const fromDate = _datemath.default.parse(range.from);

  const toDate = _datemath.default.parse(range.to, {
    roundUp: true
  });

  if (!fromDate || !toDate) {
    return;
  }

  return {
    from: fromDate.toDate(),
    to: toDate.toDate()
  };
}