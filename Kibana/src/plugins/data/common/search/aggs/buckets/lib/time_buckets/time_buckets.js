"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TimeBuckets = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _lodash = require("lodash");

var _moment = _interopRequireDefault(require("moment"));

var _utils = require("../../../utils");

var _calc_auto_interval = require("./calc_auto_interval");

var _calc_es_interval = require("./calc_es_interval");

var _interval_options = require("../../_interval_options");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function isObject(o) {
  return (0, _lodash.isObject)(o);
}

function isValidMoment(m) {
  return m && 'isValid' in m && m.isValid();
}

function isDurationInterval(i) {
  return _moment.default.isDuration(i) && Boolean(+i);
}

/**
 * Helper class for wrapping the concept of an "Interval",
 * which describes a timespan that will separate moments.
 *
 * @param {state} object - one of ""
 * @param {[type]} display [description]
 */
class TimeBuckets {
  // because other parts of Kibana arbitrarily add properties
  constructor(timeBucketConfig) {
    (0, _defineProperty2.default)(this, "_timeBucketConfig", void 0);
    (0, _defineProperty2.default)(this, "_lb", void 0);
    (0, _defineProperty2.default)(this, "_ub", void 0);
    (0, _defineProperty2.default)(this, "_originalInterval", null);
    (0, _defineProperty2.default)(this, "_i", void 0);
    this._timeBucketConfig = timeBucketConfig;
  }
  /**
   * Get a moment duration object representing
   * the distance between the bounds, if the bounds
   * are set.
   *
   * @return {moment.duration|undefined}
   */


  getDuration() {
    if (this._ub === undefined || this._lb === undefined || !this.hasBounds()) {
      return;
    }

    const difference = this._ub.valueOf() - this._lb.valueOf();

    return _moment.default.duration(difference, 'ms');
  }
  /**
   * Set the bounds that these buckets are expected to cover.
   * This is required to support interval "auto" as well
   * as interval scaling.
   *
   * @param {object} input - an object with properties min and max,
   *                       representing the edges for the time span
   *                       we should cover
   *
   * @returns {undefined}
   */


  setBounds(input) {
    if (!input) return this.clearBounds();
    let bounds;

    if ((0, _lodash.isPlainObject)(input) && !Array.isArray(input)) {
      // accept the response from timefilter.getActiveBounds()
      bounds = [input.min, input.max];
    } else {
      bounds = Array.isArray(input) ? input : [];
    }

    const moments = (0, _lodash.sortBy)(bounds, Number);
    const valid = moments.length === 2 && moments.every(isValidMoment);

    if (!valid) {
      this.clearBounds();
      throw new Error('invalid bounds set: ' + input);
    }

    this._lb = moments.shift();
    this._ub = moments.pop();
    const duration = this.getDuration();

    if (!duration || duration.asSeconds() < 0) {
      throw new TypeError('Intervals must be positive');
    }
  }
  /**
   * Clear the stored bounds
   *
   * @return {undefined}
   */


  clearBounds() {
    this._lb = this._ub = undefined;
  }
  /**
   * Check to see if we have received bounds yet
   *
   * @return {Boolean}
   */


  hasBounds() {
    return isValidMoment(this._ub) && isValidMoment(this._lb);
  }
  /**
   * Return the current bounds, if we have any.
   *
   * THIS DOES NOT CLONE THE BOUNDS, so editing them
   * may have unexpected side-effects. Always
   * call bounds.min.clone() before editing
   *
   * @return {object|undefined} - If bounds are not defined, this
   *                      returns undefined, else it returns the bounds
   *                      for these buckets. This object has two props,
   *                      min and max. Each property will be a moment()
   *                      object
   *
   */


  getBounds() {
    if (!this.hasBounds()) return;
    return {
      min: this._lb,
      max: this._ub
    };
  }
  /**
   * Update the interval at which buckets should be
   * generated.
   *
   * Input can be one of the following:
   *  - Any object from src/legacy/ui/agg_types.js
   *  - "auto"
   *  - Pass a valid moment unit
   *
   * @param {object|string|moment.duration} input - see desc
   */


  setInterval(input) {
    this._originalInterval = null;
    this._i = isObject(input) ? input.val : input;

    if (!this._i || this._i === _interval_options.autoInterval) {
      this._i = _interval_options.autoInterval;
      return;
    }

    if ((0, _lodash.isString)(this._i)) {
      const parsedInterval = (0, _utils.parseInterval)(this._i);

      if (isDurationInterval(parsedInterval)) {
        this._originalInterval = this._i;
        this._i = parsedInterval;
      }
    }

    if (!isDurationInterval(this._i)) {
      throw new TypeError('"' + this._i + '" is not a valid interval.');
    }
  }
  /**
   * Get the interval for the buckets. If the
   * number of buckets created by the interval set
   * is larger than config:histogram:maxBars then the
   * interval will be scaled up. If the number of buckets
   * created is less than one, the interval is scaled back.
   *
   * The interval object returned is a moment.duration
   * object that has been decorated with the following
   * properties.
   *
   * interval.description: a text description of the interval.
   *   designed to be used list "field per {{ desc }}".
   *     - "minute"
   *     - "10 days"
   *     - "3 years"
   *
   * interval.expression: the elasticsearch expression that creates this
   *   interval. If the interval does not properly form an elasticsearch
   *   expression it will be forced into one.
   *
   * interval.scaled: the interval was adjusted to
   *   accommodate the maxBars setting.
   *
   * interval.scale: the number that y-values should be
   *   multiplied by
   */


  getInterval(useNormalizedEsInterval = true) {
    const duration = this.getDuration();
    const parsedInterval = isDurationInterval(this._i) ? this._i : (0, _calc_auto_interval.calcAutoIntervalNear)(this._timeBucketConfig['histogram:barTarget'], Number(duration)); // check to see if the interval should be scaled, and scale it if so

    const maybeScaleInterval = interval => {
      if (!this.hasBounds() || !duration) {
        return interval;
      }

      const maxLength = this._timeBucketConfig['histogram:maxBars'];
      const minInterval = (0, _calc_auto_interval.calcAutoIntervalLessThan)(maxLength, Number(duration));
      let scaled;

      if (interval < minInterval) {
        scaled = minInterval;
      } else {
        return interval;
      }

      interval = decorateInterval(interval);
      return Object.assign(scaled, {
        preScaled: interval,
        scale: Number(interval) / Number(scaled),
        scaled: true
      });
    }; // append some TimeBuckets specific props to the interval


    const decorateInterval = interval => {
      let originalUnit;

      if (!interval.scaled && this._originalInterval) {
        var _splitStringInterval;

        originalUnit = (_splitStringInterval = (0, _utils.splitStringInterval)(this._originalInterval)) === null || _splitStringInterval === void 0 ? void 0 : _splitStringInterval.unit;
      }

      const esInterval = useNormalizedEsInterval || !this._originalInterval ? (0, _calc_es_interval.convertDurationToNormalizedEsInterval)(interval, originalUnit) : (0, _calc_es_interval.convertIntervalToEsInterval)(this._originalInterval);

      const prettyUnits = _moment.default.normalizeUnits(esInterval.unit);

      return Object.assign(interval, {
        description: esInterval.value === 1 ? prettyUnits : esInterval.value + ' ' + prettyUnits + 's',
        esValue: esInterval.value,
        esUnit: esInterval.unit,
        expression: esInterval.expression
      });
    };

    if (useNormalizedEsInterval) {
      return decorateInterval(maybeScaleInterval(parsedInterval));
    } else {
      return decorateInterval(parsedInterval);
    }
  }
  /**
   * Get a date format string that will represent dates that
   * progress at our interval.
   *
   * Since our interval can be as small as 1ms, the default
   * date format is usually way too much. with `dateFormat:scaled`
   * users can modify how dates are formatted within series
   * produced by TimeBuckets
   *
   * @return {string}
   */


  getScaledDateFormat() {
    const interval = this.getInterval();
    const rules = this._timeBucketConfig['dateFormat:scaled'];

    for (let i = rules.length - 1; i >= 0; i--) {
      const rule = rules[i];

      if (!rule[0] || interval && interval >= _moment.default.duration(rule[0])) {
        return rule[1];
      }
    }

    return this._timeBucketConfig.dateFormat;
  }

}

exports.TimeBuckets = TimeBuckets;