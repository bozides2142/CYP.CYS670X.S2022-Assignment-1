"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateImpactBuilder = calculateImpactBuilder;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function calculateImpactBuilder(sums) {
  const sumValues = (sums !== null && sums !== void 0 ? sums : []).filter(value => value !== null);
  const max = Math.max(...sumValues);
  const min = Math.min(...sumValues);
  return sum => sum !== null && sum !== undefined ? (sum - min) / (max - min) * 100 || 0 : 0;
}