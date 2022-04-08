"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IpFormat = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _i18n = require("@kbn/i18n");

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
class IpFormat extends _field_format.FieldFormat {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "textConvert", val => {
      if (val === undefined || val === null) return '-';
      if (!isFinite(val)) return String(val); // shazzam!
      // eslint-disable-next-line no-bitwise

      return [val >>> 24, val >>> 16 & 0xff, val >>> 8 & 0xff, val & 0xff].join('.');
    });
  }

}

exports.IpFormat = IpFormat;
(0, _defineProperty2.default)(IpFormat, "id", _types.FIELD_FORMAT_IDS.IP);
(0, _defineProperty2.default)(IpFormat, "title", _i18n.i18n.translate('fieldFormats.ip.title', {
  defaultMessage: 'IP address'
}));
(0, _defineProperty2.default)(IpFormat, "fieldType", _fieldTypes.KBN_FIELD_TYPES.IP);