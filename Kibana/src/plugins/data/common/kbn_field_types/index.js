"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "KbnFieldType", {
  enumerable: true,
  get: function () {
    return _fieldTypes.KbnFieldType;
  }
});
exports.getKbnTypeNames = exports.getKbnFieldType = exports.getFilterableKbnTypeNames = void 0;

var _fieldTypes = require("@kbn/field-types");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
// NOTE: trick to mark exports as deprecated (only for constants and types, but not for interfaces, classes or enums)

/**
 * @deprecated Import from the "@kbn/field-types" package directly instead.
 * @removeBy 8.1
 */
const getFilterableKbnTypeNames = _fieldTypes.getFilterableKbnTypeNames;
/**
 * @deprecated Import from the "@kbn/field-types" package directly instead.
 * @removeBy 8.1
 */

exports.getFilterableKbnTypeNames = getFilterableKbnTypeNames;
const getKbnFieldType = _fieldTypes.getKbnFieldType;
/**
 * @deprecated Import from the "@kbn/field-types" package directly instead.
 * @removeBy 8.1
 */

exports.getKbnFieldType = getKbnFieldType;
const getKbnTypeNames = _fieldTypes.getKbnTypeNames;
exports.getKbnTypeNames = getKbnTypeNames;