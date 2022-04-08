"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateBounds = calculateBounds;
exports.getAbsoluteTimeRange = getAbsoluteTimeRange;
exports.getRelativeTime = getRelativeTime;
exports.getTime = getTime;

var _datemath = _interopRequireDefault(require("@elastic/datemath"));

var _lodash = require("lodash");

var _esQuery = require("@kbn/es-query");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const calculateLowerBound = (from, forceNow) => _datemath.default.parse(from, {
  forceNow
});

const calculateUpperBound = (to, forceNow) => _datemath.default.parse(to, {
  roundUp: true,
  forceNow
});

const isRelativeTime = value => value.includes('now');

function calculateBounds(timeRange, options = {}) {
  return {
    min: calculateLowerBound(timeRange.from, options.forceNow),
    max: calculateUpperBound(timeRange.to, options.forceNow)
  };
}

function getAbsoluteTimeRange(timeRange, {
  forceNow
} = {}) {
  const {
    min,
    max
  } = calculateBounds(timeRange, {
    forceNow
  });
  return {
    from: min ? min.toISOString() : timeRange.from,
    to: max ? max.toISOString() : timeRange.to
  };
}

function getTime(indexPattern, timeRange, options) {
  return createTimeRangeFilter(indexPattern, timeRange, (options === null || options === void 0 ? void 0 : options.fieldName) || (indexPattern === null || indexPattern === void 0 ? void 0 : indexPattern.timeFieldName), options === null || options === void 0 ? void 0 : options.forceNow, true);
}

function getRelativeTime(indexPattern, timeRange, options) {
  return createTimeRangeFilter(indexPattern, timeRange, (options === null || options === void 0 ? void 0 : options.fieldName) || (indexPattern === null || indexPattern === void 0 ? void 0 : indexPattern.timeFieldName), options === null || options === void 0 ? void 0 : options.forceNow, false);
}

function createTimeRangeFilter(indexPattern, timeRange, fieldName, forceNow, coerceRelativeTimeToAbsoluteTime = true) {
  if (!indexPattern) {
    return;
  }

  const field = indexPattern.fields.find(f => f.name === (fieldName || indexPattern.timeFieldName));

  if (!field) {
    return;
  }

  let rangeFilterParams = {
    format: 'strict_date_optional_time'
  };

  if (coerceRelativeTimeToAbsoluteTime) {
    var _bounds$min, _bounds$max;

    const bounds = calculateBounds(timeRange, {
      forceNow
    });

    if (!bounds) {
      return;
    }

    rangeFilterParams.gte = (_bounds$min = bounds.min) === null || _bounds$min === void 0 ? void 0 : _bounds$min.toISOString();
    rangeFilterParams.lte = (_bounds$max = bounds.max) === null || _bounds$max === void 0 ? void 0 : _bounds$max.toISOString();
  } else {
    var _calculateLowerBound, _calculateUpperBound;

    rangeFilterParams.gte = isRelativeTime(timeRange.from) ? timeRange.from : (_calculateLowerBound = calculateLowerBound(timeRange.from, forceNow)) === null || _calculateLowerBound === void 0 ? void 0 : _calculateLowerBound.toISOString();
    rangeFilterParams.lte = isRelativeTime(timeRange.to) ? timeRange.to : (_calculateUpperBound = calculateUpperBound(timeRange.to, forceNow)) === null || _calculateUpperBound === void 0 ? void 0 : _calculateUpperBound.toISOString();
  }

  rangeFilterParams = (0, _lodash.omitBy)(rangeFilterParams, v => v == null);
  return (0, _esQuery.buildRangeFilter)(field, rangeFilterParams, indexPattern);
}