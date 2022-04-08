"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StaticLookupFormat = void 0;

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
function convertLookupEntriesToMap(lookupEntries) {
  return lookupEntries.reduce((lookupMap, lookupEntry) => {
    lookupMap[lookupEntry.key] = lookupEntry.value;
    return lookupMap;
  }, {});
}
/** @public */


class StaticLookupFormat extends _field_format.FieldFormat {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "textConvert", val => {
      const lookupEntries = this.param('lookupEntries');
      const unknownKeyValue = this.param('unknownKeyValue');
      const lookupMap = convertLookupEntriesToMap(lookupEntries);
      return lookupMap[val] || unknownKeyValue || val;
    });
  }

  getParamDefaults() {
    return {
      lookupEntries: [{}],
      unknownKeyValue: null
    };
  }

}

exports.StaticLookupFormat = StaticLookupFormat;
(0, _defineProperty2.default)(StaticLookupFormat, "id", _types.FIELD_FORMAT_IDS.STATIC_LOOKUP);
(0, _defineProperty2.default)(StaticLookupFormat, "title", _i18n.i18n.translate('fieldFormats.static_lookup.title', {
  defaultMessage: 'Static lookup'
}));
(0, _defineProperty2.default)(StaticLookupFormat, "fieldType", [_fieldTypes.KBN_FIELD_TYPES.STRING, _fieldTypes.KBN_FIELD_TYPES.NUMBER, _fieldTypes.KBN_FIELD_TYPES.IP, _fieldTypes.KBN_FIELD_TYPES.BOOLEAN]);