"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateInterval = validateInterval;

var _interval_regexp = require("./interval_regexp");

var _common = require("../../../data/common");

var _errors = require("./errors");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function validateInterval(bounds, interval, maxBuckets) {
  const {
    min,
    max
  } = bounds; // No need to check auto it will return around 100

  if (!interval) return;
  if (interval === 'auto') return;
  const greaterThanMatch = interval.match(_interval_regexp.GTE_INTERVAL_RE);
  if (greaterThanMatch) return;
  const duration = (0, _common.parseInterval)(interval);

  if (duration) {
    const span = max.valueOf() - min.valueOf();
    const buckets = Math.floor(span / duration.asMilliseconds());

    if (buckets > maxBuckets) {
      throw new _errors.ValidateIntervalError();
    }
  }
}