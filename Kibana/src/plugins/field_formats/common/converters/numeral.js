"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NumeralFormat = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _numeral = _interopRequireDefault(require("@elastic/numeral"));

var _languages = _interopRequireDefault(require("@elastic/numeral/languages"));

var _fieldTypes = require("@kbn/field-types");

var _field_format = require("../field_format");

var _ui_settings = require("../constants/ui_settings");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
// @ts-ignore
// @ts-ignore
const numeralInst = (0, _numeral.default)();

_languages.default.forEach(numeralLanguage => {
  _numeral.default.language(numeralLanguage.id, numeralLanguage.lang);
});

class NumeralFormat extends _field_format.FieldFormat {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "id", void 0);
    (0, _defineProperty2.default)(this, "title", void 0);
    (0, _defineProperty2.default)(this, "getParamDefaults", () => ({
      pattern: this.getConfig(`format:${this.id}:defaultPattern`)
    }));
    (0, _defineProperty2.default)(this, "textConvert", val => {
      return this.getConvertedValue(val);
    });
  }

  getConvertedValue(val) {
    if (val === -Infinity) return '-∞';
    if (val === +Infinity) return '+∞';

    if (typeof val !== 'number') {
      val = parseFloat(val);
    }

    if (isNaN(val)) return '';

    const previousLocale = _numeral.default.language();

    const defaultLocale = this.getConfig && this.getConfig(_ui_settings.FORMATS_UI_SETTINGS.FORMAT_NUMBER_DEFAULT_LOCALE) || 'en';

    _numeral.default.language(defaultLocale);

    const formatted = numeralInst.set(val).format(this.param('pattern'));

    _numeral.default.language(previousLocale);

    return formatted;
  }

}

exports.NumeralFormat = NumeralFormat;
(0, _defineProperty2.default)(NumeralFormat, "fieldType", _fieldTypes.KBN_FIELD_TYPES.NUMBER);