"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PercentFormat = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _i18n = require("@kbn/i18n");

var _numeral = require("./numeral");

var _types = require("../types");

var _ui_settings = require("../constants/ui_settings");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/** @public */
class PercentFormat extends _numeral.NumeralFormat {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "id", PercentFormat.id);
    (0, _defineProperty2.default)(this, "title", PercentFormat.title);
    (0, _defineProperty2.default)(this, "allowsNumericalAggregations", true);
    (0, _defineProperty2.default)(this, "getParamDefaults", () => ({
      pattern: this.getConfig(_ui_settings.FORMATS_UI_SETTINGS.FORMAT_PERCENT_DEFAULT_PATTERN),
      fractional: true
    }));
    (0, _defineProperty2.default)(this, "textConvert", val => {
      const formatted = super.getConvertedValue(val);

      if (this.param('fractional')) {
        return formatted;
      }

      return String(Number(formatted) / 100);
    });
  }

}

exports.PercentFormat = PercentFormat;
(0, _defineProperty2.default)(PercentFormat, "id", _types.FIELD_FORMAT_IDS.PERCENT);
(0, _defineProperty2.default)(PercentFormat, "title", _i18n.i18n.translate('fieldFormats.percent.title', {
  defaultMessage: 'Percentage'
}));