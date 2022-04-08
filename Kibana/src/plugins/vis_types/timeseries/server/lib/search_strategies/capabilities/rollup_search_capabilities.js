"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RollupSearchCapabilities = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _lodash = require("lodash");

var _interval_helper = require("../lib/interval_helper");

var _default_search_capabilities = require("./default_search_capabilities");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class RollupSearchCapabilities extends _default_search_capabilities.DefaultSearchCapabilities {
  constructor(options, fieldsCapabilities, rollupIndex) {
    super(options);
    (0, _defineProperty2.default)(this, "rollupIndex", void 0);
    (0, _defineProperty2.default)(this, "availableMetrics", void 0);
    this.rollupIndex = rollupIndex;
    this.availableMetrics = (0, _lodash.get)(fieldsCapabilities, `${rollupIndex}.aggs`, {});
    this.timezone = (0, _lodash.get)(this.dateHistogram, 'time_zone', null);
  }

  get dateHistogram() {
    const [dateHistogram] = Object.values(this.availableMetrics.date_histogram);
    return dateHistogram;
  }

  get defaultTimeInterval() {
    return this.dateHistogram.fixed_interval || this.dateHistogram.calendar_interval ||
    /*
       Deprecation: [interval] on [date_histogram] is deprecated, use [fixed_interval] or [calendar_interval] in the future.
       We can remove the following line only for versions > 8.x
      */
    this.dateHistogram.interval || null;
  }

  get whiteListedMetrics() {
    const baseRestrictions = this.createUiRestriction({
      count: this.createUiRestriction()
    });

    const getFields = fields => Object.keys(fields).reduce((acc, item) => ({ ...acc,
      [item]: true
    }), this.createUiRestriction({}));

    return Object.keys(this.availableMetrics).reduce((acc, item) => ({ ...acc,
      [item]: getFields(this.availableMetrics[item])
    }), baseRestrictions);
  }

  get whiteListedGroupByFields() {
    return this.createUiRestriction({
      everything: true,
      terms: (0, _lodash.has)(this.availableMetrics, 'terms')
    });
  }

  get whiteListedTimerangeModes() {
    return this.createUiRestriction({
      last_value: true
    });
  }

  get whiteListedConfigurationFeatures() {
    return this.createUiRestriction({
      filter: false
    });
  }

  getValidTimeInterval(userIntervalString) {
    const parsedRollupJobInterval = this.parseInterval(this.defaultTimeInterval);
    const inRollupJobUnit = this.convertIntervalToUnit(userIntervalString, parsedRollupJobInterval.unit);

    const getValidCalendarInterval = () => {
      let unit = parsedRollupJobInterval.unit;

      if (inRollupJobUnit.value > parsedRollupJobInterval.value) {
        const inSeconds = this.convertIntervalToUnit(userIntervalString, 's');

        if (inSeconds !== null && inSeconds !== void 0 && inSeconds.value) {
          unit = this.getSuitableUnit(inSeconds.value);
        }
      }

      return {
        value: 1,
        unit
      };
    };

    const getValidFixedInterval = () => ({
      value: (0, _interval_helper.leastCommonInterval)(inRollupJobUnit === null || inRollupJobUnit === void 0 ? void 0 : inRollupJobUnit.value, parsedRollupJobInterval === null || parsedRollupJobInterval === void 0 ? void 0 : parsedRollupJobInterval.value),
      unit: parsedRollupJobInterval.unit
    });

    const {
      value,
      unit
    } = ((0, _interval_helper.isCalendarInterval)(parsedRollupJobInterval) ? getValidCalendarInterval : getValidFixedInterval)();
    return `${value}${unit}`;
  }

}

exports.RollupSearchCapabilities = RollupSearchCapabilities;