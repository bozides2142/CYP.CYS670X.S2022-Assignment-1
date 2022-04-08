"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DateFormat = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _i18n = require("@kbn/i18n");

var _lodash = require("lodash");

var _momentTimezone = _interopRequireDefault(require("moment-timezone"));

var _fieldTypes = require("@kbn/field-types");

var _common = require("../../../common");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class DateFormat extends _common.FieldFormat {
  constructor(params, getConfig) {
    super(params, getConfig);
    (0, _defineProperty2.default)(this, "memoizedConverter", _lodash.noop);
    (0, _defineProperty2.default)(this, "memoizedPattern", '');
    (0, _defineProperty2.default)(this, "timeZone", '');
    (0, _defineProperty2.default)(this, "textConvert", val => {
      // don't give away our ref to converter so we can hot-swap when config changes
      const pattern = this.param('pattern');
      const timezone = this.param('timezone');
      const timezoneChanged = this.timeZone !== timezone;
      const datePatternChanged = this.memoizedPattern !== pattern;

      if (timezoneChanged || datePatternChanged) {
        this.timeZone = timezone;
        this.memoizedPattern = pattern;
      }

      return this.memoizedConverter(val);
    });
    this.memoizedConverter = (0, _lodash.memoize)(val => {
      if (val == null) {
        return '-';
      }
      /* On the server, importing moment returns a new instance. Unlike on
       * the client side, it doesn't have the dateFormat:tz configuration
       * baked in.
       * We need to set the timezone manually here. The date is taken in as
       * UTC and converted into the desired timezone. */


      let date;

      if (this.timeZone === 'Browser') {
        // Assume a warning has been logged this can be unpredictable. It
        // would be too verbose to log anything here.
        date = _momentTimezone.default.utc(val);
      } else {
        date = _momentTimezone.default.utc(val).tz(this.timeZone);
      }

      if (date.isValid()) {
        return date.format(this.memoizedPattern);
      } else {
        return val;
      }
    });
  }

  getParamDefaults() {
    return {
      pattern: this.getConfig('dateFormat'),
      timezone: this.getConfig('dateFormat:tz')
    };
  }

}

exports.DateFormat = DateFormat;
(0, _defineProperty2.default)(DateFormat, "id", _common.FIELD_FORMAT_IDS.DATE);
(0, _defineProperty2.default)(DateFormat, "title", _i18n.i18n.translate('fieldFormats.date.title', {
  defaultMessage: 'Date'
}));
(0, _defineProperty2.default)(DateFormat, "fieldType", _fieldTypes.KBN_FIELD_TYPES.DATE);