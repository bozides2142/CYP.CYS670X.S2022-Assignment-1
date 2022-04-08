"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DateNanosFormat = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _lodash = require("lodash");

var _momentTimezone = _interopRequireDefault(require("moment-timezone"));

var _date_nanos_shared = require("../../../common/converters/date_nanos_shared");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class DateNanosFormatServer extends _date_nanos_shared.DateNanosFormat {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "textConvert", val => {
      // don't give away our ref to converter so
      // we can hot-swap when config changes
      const pattern = this.param('pattern');
      const timezone = this.param('timezone');
      const fractPattern = (0, _date_nanos_shared.analysePatternForFract)(pattern);
      const fallbackPattern = this.param('patternFallback');
      const timezoneChanged = this.timeZone !== timezone;
      const datePatternChanged = this.memoizedPattern !== pattern;

      if (timezoneChanged || datePatternChanged) {
        this.timeZone = timezone;
        this.memoizedPattern = pattern;
        this.memoizedConverter = (0, _lodash.memoize)(value => {
          if (value === null || value === undefined) {
            return '-';
          }
          /* On the server, importing moment returns a new instance. Unlike on
           * the client side, it doesn't have the dateFormat:tz configuration
           * baked in.
           * We need to set the timezone manually here. The date is taken in as
           * UTC and converted into the desired timezone. */


          let date;

          if (this.timeZone === 'Browser') {
            // Assume a warning has been logged that this can be unpredictable. It
            // would be too verbose to log anything here.
            date = _momentTimezone.default.utc(value);
          } else {
            date = _momentTimezone.default.utc(value).tz(this.timeZone);
          }

          if (typeof value !== 'string' && date.isValid()) {
            // fallback for max/min aggregation, where unixtime in ms is returned as a number
            // aggregations in Elasticsearch generally just return ms
            return date.format(fallbackPattern);
          } else if (date.isValid() && typeof value === 'string') {
            return (0, _date_nanos_shared.formatWithNanos)(date, value, fractPattern);
          } else {
            return value;
          }
        });
      }

      return this.memoizedConverter(val);
    });
  }

}

exports.DateNanosFormat = DateNanosFormatServer;