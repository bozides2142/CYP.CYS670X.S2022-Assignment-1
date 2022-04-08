"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LEGACY_TERMS = void 0;
exports.trackLegacyTerminology = trackLegacyTerminology;

var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const LEGACY_TERMS = ['alertTypeId', 'actionTypeId'];
exports.LEGACY_TERMS = LEGACY_TERMS;

function trackLegacyTerminology(terms, usageCounter) {
  if (!usageCounter) {
    return null;
  }

  if (!terms || terms.length === 0) {
    return null;
  }

  for (const legacyTerm of LEGACY_TERMS) {
    for (const term of (0, _lodash.flatten)(terms)) {
      if (term.includes(legacyTerm)) {
        usageCounter.incrementCounter({
          counterName: `legacyTerm_${legacyTerm}`,
          counterType: 'legacyTerminology',
          incrementBy: 1
        });
      }
    }
  }
}