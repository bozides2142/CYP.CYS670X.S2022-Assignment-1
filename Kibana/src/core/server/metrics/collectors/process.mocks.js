"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMockOpsProcessMetrics = createMockOpsProcessMetrics;

var _event_loop_delays_monitor = require("../event_loop_delays/event_loop_delays_monitor.mocks");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function createMockOpsProcessMetrics() {
  const histogram = _event_loop_delays_monitor.mocked.createHistogram();

  return {
    memory: {
      heap: {
        total_in_bytes: 1,
        used_in_bytes: 1,
        size_limit: 1
      },
      resident_set_size_in_bytes: 1
    },
    event_loop_delay: 1,
    event_loop_delay_histogram: histogram,
    pid: 1,
    uptime_in_millis: 1
  };
}