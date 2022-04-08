"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ROLL_INDICES_START = exports.ROLL_DAILY_INDICES_INTERVAL = exports.MONITOR_EVENT_LOOP_WARN_THRESHOLD = exports.MONITOR_EVENT_LOOP_THRESHOLD_START = exports.MONITOR_EVENT_LOOP_THRESHOLD_INTERVAL = exports.MONITOR_EVENT_LOOP_DELAYS_START = exports.MONITOR_EVENT_LOOP_DELAYS_RESET = exports.MONITOR_EVENT_LOOP_DELAYS_INTERVAL = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Roll daily indices every 24h
 */
const ROLL_DAILY_INDICES_INTERVAL = 24 * 60 * 60 * 1000;
/**
 * Start rolling indices after 5 minutes up
 */

exports.ROLL_DAILY_INDICES_INTERVAL = ROLL_DAILY_INDICES_INTERVAL;
const ROLL_INDICES_START = 5 * 60 * 1000;
/**
 * Reset the event loop delay historgram every 1 hour
 */

exports.ROLL_INDICES_START = ROLL_INDICES_START;
const MONITOR_EVENT_LOOP_DELAYS_INTERVAL = 1 * 60 * 60 * 1000;
/**
 * Reset the event loop delay historgram every 24h
 */

exports.MONITOR_EVENT_LOOP_DELAYS_INTERVAL = MONITOR_EVENT_LOOP_DELAYS_INTERVAL;
const MONITOR_EVENT_LOOP_DELAYS_RESET = 24 * 60 * 60 * 1000;
/**
 * Start monitoring the event loop delays after 1 minute
 */

exports.MONITOR_EVENT_LOOP_DELAYS_RESET = MONITOR_EVENT_LOOP_DELAYS_RESET;
const MONITOR_EVENT_LOOP_DELAYS_START = 1 * 60 * 1000;
/**
 * Mean event loop delay threshold in ms for logging a warning.
 */

exports.MONITOR_EVENT_LOOP_DELAYS_START = MONITOR_EVENT_LOOP_DELAYS_START;
const MONITOR_EVENT_LOOP_WARN_THRESHOLD = 350;
/**
 * Start monitoring the event loop threshold after 1 minute
 */

exports.MONITOR_EVENT_LOOP_WARN_THRESHOLD = MONITOR_EVENT_LOOP_WARN_THRESHOLD;
const MONITOR_EVENT_LOOP_THRESHOLD_START = 1 * 60 * 1000;
/**
 * Check the event loop utilization every 30 seconds
 */

exports.MONITOR_EVENT_LOOP_THRESHOLD_START = MONITOR_EVENT_LOOP_THRESHOLD_START;
const MONITOR_EVENT_LOOP_THRESHOLD_INTERVAL = 30 * 1000;
exports.MONITOR_EVENT_LOOP_THRESHOLD_INTERVAL = MONITOR_EVENT_LOOP_THRESHOLD_INTERVAL;