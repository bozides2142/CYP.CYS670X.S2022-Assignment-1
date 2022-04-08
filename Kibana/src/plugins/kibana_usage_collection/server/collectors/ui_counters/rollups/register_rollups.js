"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerUiCountersRollups = registerUiCountersRollups;

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _constants = require("./constants");

var _rollups = require("./rollups");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function registerUiCountersRollups(logger, stopRollingUiCounterIndicies$, getSavedObjectsClient) {
  (0, _rxjs.timer)(_constants.ROLL_INDICES_START, _constants.ROLL_INDICES_INTERVAL).pipe((0, _operators.takeUntil)(stopRollingUiCounterIndicies$)).subscribe(() => (0, _rollups.rollUiCounterIndices)(logger, stopRollingUiCounterIndicies$, getSavedObjectsClient()));
}