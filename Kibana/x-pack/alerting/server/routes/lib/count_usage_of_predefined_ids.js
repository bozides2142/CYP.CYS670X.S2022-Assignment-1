"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.countUsageOfPredefinedIds = countUsageOfPredefinedIds;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function countUsageOfPredefinedIds({
  predefinedId,
  spaceId,
  usageCounter
}) {
  if (predefinedId && usageCounter) {
    // Track any usage of pre-defined ID
    usageCounter === null || usageCounter === void 0 ? void 0 : usageCounter.incrementCounter({
      counterName: 'ruleCreatedWithPredefinedId',
      incrementBy: 1
    });
    const isInCustomSpace = spaceId !== undefined && spaceId !== 'default';

    if (isInCustomSpace) {
      // Track usage of pre-defined ID in custom space
      usageCounter === null || usageCounter === void 0 ? void 0 : usageCounter.incrementCounter({
        counterName: 'ruleCreatedWithPredefinedIdInCustomSpace',
        incrementBy: 1
      });
    }
  }
}