"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TruncateFormat = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _i18n = require("@kbn/i18n");

var _lodash = require("lodash");

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
const omission = '...';
/** @public */

class TruncateFormat extends _field_format.FieldFormat {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "textConvert", val => {
      const length = this.param('fieldLength');

      if (length > 0) {
        return (0, _lodash.truncate)(val, {
          length: length + omission.length,
          omission
        });
      }

      return val;
    });
  }

}

exports.TruncateFormat = TruncateFormat;
(0, _defineProperty2.default)(TruncateFormat, "id", _types.FIELD_FORMAT_IDS.TRUNCATE);
(0, _defineProperty2.default)(TruncateFormat, "title", _i18n.i18n.translate('fieldFormats.truncated_string.title', {
  defaultMessage: 'Truncated string'
}));
(0, _defineProperty2.default)(TruncateFormat, "fieldType", _fieldTypes.KBN_FIELD_TYPES.STRING);