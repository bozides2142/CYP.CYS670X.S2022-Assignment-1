"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDataViewFieldSubtypeMulti = getDataViewFieldSubtypeMulti;
exports.getDataViewFieldSubtypeNested = getDataViewFieldSubtypeNested;
exports.getFieldSubtypeNested = exports.getFieldSubtypeMulti = void 0;
exports.isDataViewFieldSubtypeMulti = isDataViewFieldSubtypeMulti;
exports.isDataViewFieldSubtypeNested = isDataViewFieldSubtypeNested;
exports.isFilterable = isFilterable;
exports.isNestedField = exports.isMultiField = void 0;
exports.shortenDottedString = shortenDottedString;

var _fieldTypes = require("@kbn/field-types");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const filterableTypes = (0, _fieldTypes.getFilterableKbnTypeNames)();

function isFilterable(field) {
  return field.name === '_id' || field.scripted || Boolean(field.searchable && filterableTypes.includes(field.type));
}

const isNestedField = isDataViewFieldSubtypeNested;
exports.isNestedField = isNestedField;
const isMultiField = isDataViewFieldSubtypeMulti;
exports.isMultiField = isMultiField;
const getFieldSubtypeMulti = getDataViewFieldSubtypeMulti;
exports.getFieldSubtypeMulti = getFieldSubtypeMulti;
const getFieldSubtypeNested = getDataViewFieldSubtypeNested;
exports.getFieldSubtypeNested = getFieldSubtypeNested;
const DOT_PREFIX_RE = /(.).+?\./g;
/**
 * Convert a dot.notated.string into a short
 * version (d.n.string)
 *
 * @return {any}
 */

function shortenDottedString(input) {
  return typeof input !== 'string' ? input : input.replace(DOT_PREFIX_RE, '$1.');
} // Note - this code is duplicated from @kbn/es-query
// as importing code adds about 30k to the data_view bundle size


function isDataViewFieldSubtypeNested(field) {
  var _subTypeNested$nested;

  const subTypeNested = field === null || field === void 0 ? void 0 : field.subType;
  return !!(subTypeNested !== null && subTypeNested !== void 0 && (_subTypeNested$nested = subTypeNested.nested) !== null && _subTypeNested$nested !== void 0 && _subTypeNested$nested.path);
}

function getDataViewFieldSubtypeNested(field) {
  return isDataViewFieldSubtypeNested(field) ? field.subType : undefined;
}

function isDataViewFieldSubtypeMulti(field) {
  var _subTypeNested$multi;

  const subTypeNested = field === null || field === void 0 ? void 0 : field.subType;
  return !!(subTypeNested !== null && subTypeNested !== void 0 && (_subTypeNested$multi = subTypeNested.multi) !== null && _subTypeNested$multi !== void 0 && _subTypeNested$multi.parent);
}

function getDataViewFieldSubtypeMulti(field) {
  return isDataViewFieldSubtypeMulti(field) ? field.subType : undefined;
}