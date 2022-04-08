"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SourceFormat = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

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
class SourceFormat extends _field_format.FieldFormat {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "textConvert", value => JSON.stringify(value));
  }

}

exports.SourceFormat = SourceFormat;
(0, _defineProperty2.default)(SourceFormat, "id", _types.FIELD_FORMAT_IDS._SOURCE);
(0, _defineProperty2.default)(SourceFormat, "title", '_source');
(0, _defineProperty2.default)(SourceFormat, "fieldType", _fieldTypes.KBN_FIELD_TYPES._SOURCE);