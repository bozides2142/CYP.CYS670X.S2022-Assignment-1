"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HistogramFormat = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _i18n = require("@kbn/i18n");

var _fieldTypes = require("@kbn/field-types");

var _field_format = require("../field_format");

var _types = require("../types");

var _bytes = require("./bytes");

var _number = require("./number");

var _percent = require("./percent");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/** @public */
class HistogramFormat extends _field_format.FieldFormat {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "id", HistogramFormat.id);
    (0, _defineProperty2.default)(this, "title", HistogramFormat.title);
    (0, _defineProperty2.default)(this, "allowsNumericalAggregations", true);
    (0, _defineProperty2.default)(this, "textConvert", val => {
      if (typeof val === 'number') {
        const subFormatId = this.param('id');
        const SubFormat = subFormatId === 'bytes' ? _bytes.BytesFormat : subFormatId === 'percent' ? _percent.PercentFormat : _number.NumberFormat;
        const converter = new SubFormat(this.param('params'), this.getConfig);
        return converter.textConvert(val);
      } else {
        return JSON.stringify(val);
      }
    });
  }

  // Nested internal formatter
  getParamDefaults() {
    return {
      id: 'number',
      params: {}
    };
  }

}

exports.HistogramFormat = HistogramFormat;
(0, _defineProperty2.default)(HistogramFormat, "id", _types.FIELD_FORMAT_IDS.HISTOGRAM);
(0, _defineProperty2.default)(HistogramFormat, "fieldType", _fieldTypes.KBN_FIELD_TYPES.HISTOGRAM);
(0, _defineProperty2.default)(HistogramFormat, "title", _i18n.i18n.translate('fieldFormats.histogram.title', {
  defaultMessage: 'Histogram'
}));