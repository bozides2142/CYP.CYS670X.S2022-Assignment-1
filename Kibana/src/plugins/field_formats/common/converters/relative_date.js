"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RelativeDateFormat = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _i18n = require("@kbn/i18n");

var _moment = _interopRequireDefault(require("moment"));

var _fieldTypes = require("@kbn/field-types");

var _field_format = require("../field_format");

var _types = require("../types");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/** @public */
class RelativeDateFormat extends _field_format.FieldFormat {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "textConvert", val => {
      if (val === null || val === undefined) {
        return '-';
      }

      const date = (0, _moment.default)(val);

      if (date.isValid()) {
        return date.fromNow();
      } else {
        return String(val);
      }
    });
  }

}

exports.RelativeDateFormat = RelativeDateFormat;
(0, _defineProperty2.default)(RelativeDateFormat, "id", _types.FIELD_FORMAT_IDS.RELATIVE_DATE);
(0, _defineProperty2.default)(RelativeDateFormat, "title", _i18n.i18n.translate('fieldFormats.relative_date.title', {
  defaultMessage: 'Relative date'
}));
(0, _defineProperty2.default)(RelativeDateFormat, "fieldType", _fieldTypes.KBN_FIELD_TYPES.DATE);