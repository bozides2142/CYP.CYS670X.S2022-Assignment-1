"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.timeIntervalTriggeringPolicyConfigSchema = exports.TimeIntervalTriggeringPolicy = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _configSchema = require("@kbn/config-schema");

var _get_next_rolling_time = require("./get_next_rolling_time");

var _utils = require("./utils");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const timeIntervalTriggeringPolicyConfigSchema = _configSchema.schema.object({
  type: _configSchema.schema.literal('time-interval'),
  interval: _configSchema.schema.duration({
    defaultValue: '24h',
    validate: interval => {
      if (!(0, _utils.isValidRolloverInterval)(interval)) {
        return 'Interval value cannot overflow to a higher time unit.';
      }
    }
  }),
  modulate: _configSchema.schema.boolean({
    defaultValue: true
  })
});
/**
 * A triggering policy based on a fixed time interval
 */


exports.timeIntervalTriggeringPolicyConfigSchema = timeIntervalTriggeringPolicyConfigSchema;

class TimeIntervalTriggeringPolicy {
  /**
   * milliseconds timestamp of when the next rollover should occur.
   */
  constructor(config, context) {
    (0, _defineProperty2.default)(this, "nextRolloverTime", void 0);
    this.config = config;
    this.nextRolloverTime = (0, _get_next_rolling_time.getNextRollingTime)(context.currentFileTime || Date.now(), config.interval, config.modulate);
  }

  isTriggeringEvent(record) {
    const eventTime = record.timestamp.getTime();

    if (eventTime >= this.nextRolloverTime) {
      this.nextRolloverTime = (0, _get_next_rolling_time.getNextRollingTime)(eventTime, this.config.interval, this.config.modulate);
      return true;
    }

    return false;
  }

}

exports.TimeIntervalTriggeringPolicy = TimeIntervalTriggeringPolicy;