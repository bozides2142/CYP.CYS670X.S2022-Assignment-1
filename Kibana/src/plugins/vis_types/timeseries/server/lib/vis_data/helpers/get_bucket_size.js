"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBucketSize = void 0;

var _unit_to_seconds = require("./unit_to_seconds");

var _get_timerange = require("./get_timerange");

var _interval_regexp = require("../../../../common/interval_regexp");

var _server = require("../../../../../../data/server");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const calculateBucketData = (timeInterval, capabilities) => {
  var _capabilities$getVali, _intervalStringMatch$;

  let intervalString = (_capabilities$getVali = capabilities === null || capabilities === void 0 ? void 0 : capabilities.getValidTimeInterval(timeInterval)) !== null && _capabilities$getVali !== void 0 ? _capabilities$getVali : timeInterval;
  const intervalStringMatch = intervalString.match(_interval_regexp.INTERVAL_STRING_RE);
  const parsedInterval = (0, _unit_to_seconds.parseInterval)(intervalString);
  let bucketSize = Number((_intervalStringMatch$ = intervalStringMatch === null || intervalStringMatch === void 0 ? void 0 : intervalStringMatch[1]) !== null && _intervalStringMatch$ !== void 0 ? _intervalStringMatch$ : 0) * (0, _unit_to_seconds.getUnitValue)(intervalStringMatch === null || intervalStringMatch === void 0 ? void 0 : intervalStringMatch[2]); // don't go too small

  if (bucketSize < 1) {
    bucketSize = 1;
  } // Check decimal


  if (parsedInterval && parsedInterval.value % 1 !== 0) {
    if (parsedInterval.unit !== 'ms') {
      const converted = (0, _unit_to_seconds.convertIntervalToUnit)(intervalString, _unit_to_seconds.ASCENDING_UNIT_ORDER[_unit_to_seconds.ASCENDING_UNIT_ORDER.indexOf(parsedInterval.unit) - 1]);

      if (converted) {
        intervalString = converted.value + converted.unit;
      }
    } else {
      intervalString = '1ms';
    }
  }

  return {
    bucketSize,
    intervalString
  };
};

const calcAutoInterval = (req, maxBars) => {
  const {
    from,
    to
  } = (0, _get_timerange.getTimerange)(req);
  const timerange = to.valueOf() - from.valueOf();
  return _server.search.aggs.calcAutoIntervalLessThan(maxBars, timerange).asSeconds();
};

const getBucketSize = (req, interval, capabilities, bars) => {
  const userIntervalMatches = Boolean(interval) && interval.match(_interval_regexp.INTERVAL_STRING_RE);

  if (userIntervalMatches) {
    return calculateBucketData(interval, capabilities);
  }

  const gteAutoMatch = Boolean(interval) && interval.match(_interval_regexp.GTE_INTERVAL_RE);
  const autoInterval = calcAutoInterval(req, bars);
  const autoBucketData = calculateBucketData(`${autoInterval}s`, capabilities);

  if (gteAutoMatch) {
    const gteBucketData = calculateBucketData(gteAutoMatch[1], capabilities);
    const gteInSecondInterval = (0, _unit_to_seconds.convertIntervalToUnit)(gteBucketData.intervalString, 's');

    if (gteInSecondInterval && (gteInSecondInterval === null || gteInSecondInterval === void 0 ? void 0 : gteInSecondInterval.value) > autoInterval) {
      return gteBucketData;
    }
  }

  return autoBucketData;
};

exports.getBucketSize = getBucketSize;