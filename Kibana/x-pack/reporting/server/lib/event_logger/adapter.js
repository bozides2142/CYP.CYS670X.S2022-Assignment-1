"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EcsLogAdapter = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _deepmerge = _interopRequireDefault(require("deepmerge"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/** @internal */


class EcsLogAdapter {
  /**
   * This class provides a logging system to Reporting code, using a shape similar to the EventLog service.
   * The logging action causes ECS data with Reporting metrics sent to DEBUG logs.
   *
   * @param {LevelLogger} logger - Reporting's wrapper of the core logger
   * @param {Partial<LogMeta>} properties - initial ECS data with template for Reporting metrics
   */
  constructor(logger, properties) {
    (0, _defineProperty2.default)(this, "start", void 0);
    (0, _defineProperty2.default)(this, "end", void 0);
    this.logger = logger;
    this.properties = properties;
  }

  logEvent(message, properties) {
    var _this$start, _this$end;

    if (this.start && !this.end) {
      this.end = new Date(Date.now());
    }

    let duration;

    if (this.end && this.start) {
      duration = (this.end.valueOf() - this.start.valueOf()) * 1000000; // nanoseconds
    } // add the derived properties for timing between "start" and "complete" logging calls


    const newProperties = (0, _deepmerge.default)(this.properties, {
      event: {
        duration,
        start: (_this$start = this.start) === null || _this$start === void 0 ? void 0 : _this$start.toISOString(),
        end: (_this$end = this.end) === null || _this$end === void 0 ? void 0 : _this$end.toISOString()
      }
    }); // sends an ECS object with Reporting metrics to the DEBUG logs

    this.logger.debug(message, ['events'], (0, _deepmerge.default)(newProperties, properties));
  }

  startTiming() {
    this.start = new Date(Date.now());
  }

  stopTiming() {
    this.end = new Date(Date.now());
  }

}

exports.EcsLogAdapter = EcsLogAdapter;