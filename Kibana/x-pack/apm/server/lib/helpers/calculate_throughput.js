"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateThroughput = calculateThroughput;
exports.calculateThroughputWithInterval = calculateThroughputWithInterval;
exports.calculateThroughputWithRange = calculateThroughputWithRange;
exports.getThroughputUnit = getThroughputUnit;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * @deprecated use calculateThroughputWithRange instead
 */

function calculateThroughput({
  start,
  end,
  value
}) {
  const durationAsMinutes = (end - start) / 1000 / 60;
  return value / durationAsMinutes;
}

function calculateThroughputWithRange({
  start,
  end,
  value
}) {
  const durationAsMinutes = (end - start) / 1000 / 60;
  return value / durationAsMinutes;
}

function calculateThroughputWithInterval({
  bucketSize,
  value
}) {
  const durationAsMinutes = bucketSize / 60;
  return value / durationAsMinutes;
}

function getThroughputUnit(bucketSize) {
  return bucketSize >= 60 ? 'minute' : 'second';
}