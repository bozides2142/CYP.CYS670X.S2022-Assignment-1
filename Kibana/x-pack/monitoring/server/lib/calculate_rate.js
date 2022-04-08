"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateRate = calculateRate;

var _moment = _interopRequireDefault(require("moment"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function calculateRate({
  hitTimestamp = null,
  earliestHitTimestamp = null,
  latestTotal = null,
  earliestTotal = null,
  timeWindowMin,
  timeWindowMax
}) {
  const nullResult = {
    rate: null,
    isEstimate: false
  }; // check if any params used for calculations are null

  if (hitTimestamp === null || earliestHitTimestamp === null || latestTotal === null || earliestTotal === null) {
    return nullResult;
  }

  const hitTimestampMoment = (0, _moment.default)(hitTimestamp).valueOf();
  const earliestHitTimestampMoment = (0, _moment.default)(earliestHitTimestamp).valueOf();
  const hitsTimeDelta = hitTimestampMoment - earliestHitTimestampMoment;

  if (hitsTimeDelta < 1) {
    return nullResult;
  }

  const earliestTimeInMillis = (0, _moment.default)(timeWindowMin).valueOf();
  const latestTimeInMillis = (0, _moment.default)(timeWindowMax).valueOf();
  const millisDelta = latestTimeInMillis - earliestTimeInMillis;
  let rate = null;
  let isEstimate = false;

  if (millisDelta !== 0) {
    const totalDelta = Number(latestTotal) - Number(earliestTotal);

    if (totalDelta < 0) {
      rate = Number(latestTotal) / (millisDelta / 1000); // a restart caused an unwanted negative rate

      isEstimate = true;
    } else {
      rate = totalDelta / (millisDelta / 1000);
    }
  }

  return {
    rate,
    isEstimate
  };
}