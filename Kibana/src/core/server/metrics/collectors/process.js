"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProcessMetricsCollector = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _v = _interopRequireDefault(require("v8"));

var _event_loop_delays = require("../event_loop_delays");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class ProcessMetricsCollector {
  constructor() {
    (0, _defineProperty2.default)(this, "eventLoopDelayMonitor", new _event_loop_delays.EventLoopDelaysMonitor());
  }

  static getMainThreadMetrics(processes) {
    /**
     * Currently Kibana does not support multi-processes.
     * Once we have multiple processes we can add a `name` field
     * and filter on `name === 'server_worker'` to get the main thread.
     */
    return processes[0];
  }

  getCurrentPidMetrics() {
    const eventLoopDelayHistogram = this.eventLoopDelayMonitor.collect();

    const heapStats = _v.default.getHeapStatistics();

    const memoryUsage = process.memoryUsage();
    return {
      memory: {
        heap: {
          total_in_bytes: memoryUsage.heapTotal,
          used_in_bytes: memoryUsage.heapUsed,
          size_limit: heapStats.heap_size_limit
        },
        resident_set_size_in_bytes: memoryUsage.rss
      },
      pid: process.pid,
      event_loop_delay: eventLoopDelayHistogram.mean,
      event_loop_delay_histogram: eventLoopDelayHistogram,
      uptime_in_millis: process.uptime() * 1000
    };
  }

  collect() {
    return [this.getCurrentPidMetrics()];
  }

  reset() {
    this.eventLoopDelayMonitor.reset();
  }

}

exports.ProcessMetricsCollector = ProcessMetricsCollector;