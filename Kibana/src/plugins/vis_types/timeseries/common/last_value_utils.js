"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isEmptyValue = exports.getLastValue = exports.EMPTY_VALUE = exports.DISPLAY_EMPTY_VALUE = void 0;

var _lodash = require("lodash");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const EMPTY_VALUE = null;
exports.EMPTY_VALUE = EMPTY_VALUE;
const DISPLAY_EMPTY_VALUE = '-';
exports.DISPLAY_EMPTY_VALUE = DISPLAY_EMPTY_VALUE;

const extractValue = data => {
  var _ref;

  return (_ref = data && data[1]) !== null && _ref !== void 0 ? _ref : EMPTY_VALUE;
};

const getLastValue = data => {
  if (!(0, _lodash.isArray)(data)) {
    return data;
  }

  return extractValue((0, _lodash.last)(data));
};

exports.getLastValue = getLastValue;

const isEmptyValue = value => (0, _lodash.isEqual)(value, EMPTY_VALUE);

exports.isEmptyValue = isEmptyValue;