"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.timeShift = timeShift;

var _lodash = require("lodash");

var _momentTimezone = _interopRequireDefault(require("moment-timezone"));

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function timeShift(resp, panel, series, meta, extractFields, fieldFormatService, cachedIndexPatternFetcher, timezone) {
  return next => results => {
    if (/^([+-]?[\d]+)([shmdwMy]|ms)$/.test(series.offset_time)) {
      const matches = series.offset_time.match(/^([+-]?[\d]+)([shmdwMy]|ms)$/);

      if (matches) {
        const offsetValue = matches[1];
        const offsetUnit = matches[2];
        const defaultTimezone = (0, _momentTimezone.default)().zoneName();

        try {
          if (!panel.ignore_daylight_time) {
            // the datemath plugin always parses dates by using the current default moment time zone.
            // to use the configured time zone, we are switching just for the bounds calculation.
            // The code between this call and the reset in the finally block is not allowed to get async,
            // otherwise the timezone setting can leak out of this function.
            _momentTimezone.default.tz.setDefault(timezone);
          }

          results.forEach(item => {
            if ((0, _lodash.startsWith)(item.id, series.id)) {
              item.data = item.data.map(row => [(panel.ignore_daylight_time ? _momentTimezone.default.utc : _momentTimezone.default)(row[0]).add(offsetValue, offsetUnit).valueOf(), row[1]]);
            }
          });
        } finally {
          if (!panel.ignore_daylight_time) {
            // reset default moment timezone
            _momentTimezone.default.tz.setDefault(defaultTimezone);
          }
        }
      }
    }

    return next(results);
  };
}