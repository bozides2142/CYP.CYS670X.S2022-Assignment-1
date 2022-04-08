"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOffsetInMs = getOffsetInMs;

var _moment = _interopRequireDefault(require("moment"));

var _common = require("../../../../../src/plugins/data/common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getOffsetInMs({
  start,
  end,
  offset
}) {
  if (!offset) {
    return {
      startWithOffset: start,
      endWithOffset: end,
      offsetInMs: 0
    };
  }

  const interval = (0, _common.parseInterval)(offset);

  if (!interval) {
    throw new Error(`Could not parse offset: ${offset}`);
  }

  const calculatedOffset = start - (0, _moment.default)(start).subtract(interval).valueOf();
  return {
    startWithOffset: start - calculatedOffset,
    endWithOffset: end - calculatedOffset,
    offsetInMs: calculatedOffset
  };
}