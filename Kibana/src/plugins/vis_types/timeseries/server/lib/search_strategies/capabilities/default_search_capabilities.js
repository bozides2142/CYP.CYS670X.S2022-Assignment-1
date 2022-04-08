"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DefaultSearchCapabilities = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _unit_to_seconds = require("../../vis_data/helpers/unit_to_seconds");

var _ui_restrictions = require("../../../../common/ui_restrictions");

var _enums = require("../../../../common/enums");

var _agg_utils = require("../../../../common/agg_utils");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const convertAggsToRestriction = allAvailableAggs => allAvailableAggs.reduce((availableAggs, aggType) => ({ ...availableAggs,
  [aggType]: {
    '*': true
  }
}), {});

class DefaultSearchCapabilities {
  constructor(options) {
    (0, _defineProperty2.default)(this, "timezone", void 0);
    (0, _defineProperty2.default)(this, "maxBucketsLimit", void 0);
    (0, _defineProperty2.default)(this, "panel", void 0);
    this.timezone = options.timezone;
    this.maxBucketsLimit = options.maxBucketsLimit;
    this.panel = options.panel;
  }

  get defaultTimeInterval() {
    return null;
  }

  get whiteListedMetrics() {
    if (this.panel) {
      var _this$panel;

      const aggs = (0, _agg_utils.getAggsByType)(agg => agg.id);

      if (this.panel.type !== _enums.PANEL_TYPES.TIMESERIES && this.panel.time_range_mode === _enums.TIME_RANGE_DATA_MODES.ENTIRE_TIME_RANGE) {
        return this.createUiRestriction(convertAggsToRestriction([...aggs[_agg_utils.AGG_TYPE.METRIC], ...aggs[_agg_utils.AGG_TYPE.SIBLING_PIPELINE], _enums.TSVB_METRIC_TYPES.MATH, _enums.TSVB_METRIC_TYPES.CALCULATION, _enums.BUCKET_TYPES.TERMS, // SERIES_AGG should be blocked for table
        ...(this.panel.type === _enums.PANEL_TYPES.TABLE ? [] : [_enums.TSVB_METRIC_TYPES.SERIES_AGG])]));
      }

      if (((_this$panel = this.panel) === null || _this$panel === void 0 ? void 0 : _this$panel.type) === _enums.PANEL_TYPES.TABLE) {
        return this.createUiRestriction(convertAggsToRestriction([...Object.values(aggs).flat(), _enums.BUCKET_TYPES.TERMS].filter(item => item !== _enums.TSVB_METRIC_TYPES.SERIES_AGG)));
      }
    }

    return this.createUiRestriction();
  }

  get whiteListedGroupByFields() {
    return this.createUiRestriction();
  }

  get whiteListedTimerangeModes() {
    return this.createUiRestriction();
  }

  get whiteListedConfigurationFeatures() {
    return this.createUiRestriction();
  }

  get uiRestrictions() {
    return {
      [_ui_restrictions.RESTRICTIONS_KEYS.WHITE_LISTED_METRICS]: this.whiteListedMetrics,
      [_ui_restrictions.RESTRICTIONS_KEYS.WHITE_LISTED_GROUP_BY_FIELDS]: this.whiteListedGroupByFields,
      [_ui_restrictions.RESTRICTIONS_KEYS.WHITE_LISTED_TIMERANGE_MODES]: this.whiteListedTimerangeModes,
      [_ui_restrictions.RESTRICTIONS_KEYS.WHITE_LISTED_CONFIGURATION_FEATURES]: this.whiteListedConfigurationFeatures
    };
  }

  createUiRestriction(restrictionsObject) {
    return {
      '*': !restrictionsObject,
      ...(restrictionsObject || {})
    };
  }

  parseInterval(interval) {
    return (0, _unit_to_seconds.parseInterval)(interval);
  }

  getSuitableUnit(intervalInSeconds) {
    return (0, _unit_to_seconds.getSuitableUnit)(intervalInSeconds);
  }

  convertIntervalToUnit(intervalString, unit) {
    const parsedInterval = this.parseInterval(intervalString);

    if ((parsedInterval === null || parsedInterval === void 0 ? void 0 : parsedInterval.unit) !== unit) {
      return (0, _unit_to_seconds.convertIntervalToUnit)(intervalString, unit);
    }

    return parsedInterval;
  }

  getValidTimeInterval(intervalString) {
    // Default search capabilities doesn't have any restrictions for the interval string
    return intervalString;
  }

}

exports.DefaultSearchCapabilities = DefaultSearchCapabilities;