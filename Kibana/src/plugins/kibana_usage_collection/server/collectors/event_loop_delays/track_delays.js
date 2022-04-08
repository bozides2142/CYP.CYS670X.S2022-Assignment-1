"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startTrackingEventLoopDelaysUsage = startTrackingEventLoopDelaysUsage;

var _operators = require("rxjs/operators");

var _rxjs = require("rxjs");

var _constants = require("./constants");

var _saved_objects = require("./saved_objects");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * The monitoring of the event loop starts immediately.
 * The first collection of the histogram happens after 1 minute.
 * The daily histogram data is updated every 1 hour.
 * The histogram metrics are in milliseconds.
 */
function startTrackingEventLoopDelaysUsage(internalRepository, instanceUuid, stopMonitoringEventLoop$, eventLoopDelaysMonitor, configs = {}) {
  const {
    collectionStartDelay = _constants.MONITOR_EVENT_LOOP_DELAYS_START,
    collectionInterval = _constants.MONITOR_EVENT_LOOP_DELAYS_INTERVAL,
    histogramReset = _constants.MONITOR_EVENT_LOOP_DELAYS_RESET
  } = configs;
  const resetOnCount = Math.ceil(histogramReset / collectionInterval);
  (0, _rxjs.timer)(collectionStartDelay, collectionInterval).pipe((0, _operators.map)(i => (i + 1) % resetOnCount === 0), (0, _operators.takeUntil)(stopMonitoringEventLoop$), (0, _operators.finalize)(() => eventLoopDelaysMonitor.stop())).subscribe(async shouldReset => {
    const histogram = eventLoopDelaysMonitor.collect();

    if (shouldReset) {
      eventLoopDelaysMonitor.reset();
    }

    try {
      await (0, _saved_objects.storeHistogram)(histogram, internalRepository, instanceUuid);
    } catch (e) {// do not crash if cannot store a histogram.
    }
  });
}