"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TelemetryQueue = exports.TELEMETRY_MAX_QUEUE_SIZE = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const TELEMETRY_MAX_QUEUE_SIZE = 100;
exports.TELEMETRY_MAX_QUEUE_SIZE = TELEMETRY_MAX_QUEUE_SIZE;

class TelemetryQueue {
  constructor() {
    (0, _defineProperty2.default)(this, "maxQueueSize", TELEMETRY_MAX_QUEUE_SIZE);
    (0, _defineProperty2.default)(this, "queue", []);
  }

  addEvents(events) {
    const qlength = this.queue.length;

    if (events.length === 0) {
      return;
    }

    if (qlength >= this.maxQueueSize) {
      // we're full already
      return;
    }

    if (events.length > this.maxQueueSize - qlength) {
      this.queue.push(...events.slice(0, this.maxQueueSize - qlength));
    } else {
      this.queue.push(...events);
    }
  }

  clearEvents() {
    this.queue = [];
  }

  getEvents() {
    return this.queue;
  }

}

exports.TelemetryQueue = TelemetryQueue;