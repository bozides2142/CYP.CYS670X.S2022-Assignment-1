"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startTrackingEventLoopDelaysThreshold = startTrackingEventLoopDelaysThreshold;

var _operators = require("rxjs/operators");

var _rxjs = require("rxjs");

var _constants = require("./constants");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * The monitoring of the event loop starts immediately.
 * The first collection happens after 1 minute.
 * The histogram is collected and reset every 20 seconds.
 * logs a warning when threshold is exceeded (350ms) and increments a usage counter.
 */
function startTrackingEventLoopDelaysThreshold(eventLoopCounter, logger, stopMonitoringEventLoop$, eventLoopDelaysMonitor, configs = {}) {
  const {
    warnThreshold = _constants.MONITOR_EVENT_LOOP_WARN_THRESHOLD,
    collectionStartDelay = _constants.MONITOR_EVENT_LOOP_THRESHOLD_START,
    collectionInterval = _constants.MONITOR_EVENT_LOOP_THRESHOLD_INTERVAL
  } = configs;
  (0, _rxjs.timer)(collectionStartDelay, collectionInterval).pipe((0, _operators.takeUntil)(stopMonitoringEventLoop$), (0, _operators.finalize)(() => eventLoopDelaysMonitor.stop())).subscribe(async () => {
    const {
      mean: meanMS
    } = eventLoopDelaysMonitor.collect();

    if (meanMS > warnThreshold) {
      logger.warn(`Average event loop delay threshold exceeded ${warnThreshold}ms. Received ${meanMS}ms. ` + `See https://ela.st/kibana-scaling-considerations for more information about scaling Kibana.`);
      eventLoopCounter.incrementCounter({
        counterName: 'delay_threshold_exceeded'
      });
    }

    eventLoopDelaysMonitor.reset();
  });
}