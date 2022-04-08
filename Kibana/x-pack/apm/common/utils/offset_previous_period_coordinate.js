"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.offsetPreviousPeriodCoordinates = offsetPreviousPeriodCoordinates;

var _moment = _interopRequireDefault(require("moment"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function offsetPreviousPeriodCoordinates({
  currentPeriodTimeseries,
  previousPeriodTimeseries
}) {
  var _currentPeriodTimeser;

  if (!(previousPeriodTimeseries !== null && previousPeriodTimeseries !== void 0 && previousPeriodTimeseries.length)) {
    return [];
  }

  const currentPeriodStart = (_currentPeriodTimeser = currentPeriodTimeseries === null || currentPeriodTimeseries === void 0 ? void 0 : currentPeriodTimeseries[0].x) !== null && _currentPeriodTimeser !== void 0 ? _currentPeriodTimeser : 0;
  const dateDiff = currentPeriodStart - previousPeriodTimeseries[0].x;
  return previousPeriodTimeseries.map(({
    x,
    y
  }) => {
    const offsetX = (0, _moment.default)(x).add(dateDiff).valueOf();
    return {
      x: offsetX,
      y
    };
  });
}