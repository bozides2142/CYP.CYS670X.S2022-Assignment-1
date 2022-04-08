"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseTimeShift = void 0;

var _moment = _interopRequireDefault(require("moment"));

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const allowedUnits = ['s', 'm', 'h', 'd', 'w', 'M', 'y'];

/**
 * This method parses a string into a time shift duration.
 * If parsing fails, 'invalid' is returned.
 * Allowed values are the string 'previous' and an integer followed by the units s,m,h,d,w,M,y
 *  */
const parseTimeShift = val => {
  const trimmedVal = val.trim();

  if (trimmedVal === 'previous') {
    return 'previous';
  }

  const [, amount, unit] = trimmedVal.match(/^(\d+)\s*(\w)$/) || [];
  const parsedAmount = Number(amount);

  if (Number.isNaN(parsedAmount) || !allowedUnits.includes(unit)) {
    return 'invalid';
  }

  return _moment.default.duration(Number(amount), unit);
};

exports.parseTimeShift = parseTimeShift;