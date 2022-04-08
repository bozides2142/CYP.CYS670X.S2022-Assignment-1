"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BoolFormat = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _i18n = require("@kbn/i18n");

var _fieldTypes = require("@kbn/field-types");

var _field_format = require("../field_format");

var _types = require("../types");

var _utils = require("../utils");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/** @public */
class BoolFormat extends _field_format.FieldFormat {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "textConvert", value => {
      if (typeof value === 'string') {
        value = value.trim().toLowerCase();
      }

      switch (value) {
        case false:
        case 0:
        case 'false':
        case 'no':
          return 'false';

        case true:
        case 1:
        case 'true':
        case 'yes':
          return 'true';

        default:
          return (0, _utils.asPrettyString)(value);
      }
    });
  }

}

exports.BoolFormat = BoolFormat;
(0, _defineProperty2.default)(BoolFormat, "id", _types.FIELD_FORMAT_IDS.BOOLEAN);
(0, _defineProperty2.default)(BoolFormat, "title", _i18n.i18n.translate('fieldFormats.boolean.title', {
  defaultMessage: 'Boolean'
}));
(0, _defineProperty2.default)(BoolFormat, "fieldType", [_fieldTypes.KBN_FIELD_TYPES.BOOLEAN, _fieldTypes.KBN_FIELD_TYPES.NUMBER, _fieldTypes.KBN_FIELD_TYPES.STRING]);