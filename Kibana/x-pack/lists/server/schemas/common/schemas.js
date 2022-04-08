"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.textOrUndefined = exports.text = exports.shortOrUndefined = exports.short = exports.shapeOrUndefined = exports.shape = exports.long_range = exports.longRangeOrUndefined = exports.longOrUndefined = exports.long = exports.keywordOrUndefined = exports.keyword = exports.ip_range = exports.ipRangeOrUndefined = exports.ipOrUndefined = exports.ip = exports.integer_range = exports.integerRangeOrUndefined = exports.integerOrUndefined = exports.integer = exports.half_float = exports.halfFloatOrUndefined = exports.geo_shape = exports.geo_point = exports.geoShapeOrUndefined = exports.geoPointOrUndefined = exports.float_range = exports.floatRangeOrUndefined = exports.floatOrUndefined = exports.float = exports.esDataTypeUnion = exports.esDataTypeSingle = exports.esDataTypeRangeTerm = exports.esDataTypeRange = exports.esDataTypeGeoShape = exports.esDataTypeGeoPointRange = exports.esDataTypeGeoPoint = exports.double_range = exports.doubleRangeOrUndefined = exports.doubleOrUndefined = exports.double = exports.date_range = exports.date_nanos = exports.dateRangeOrUndefined = exports.dateOrUndefined = exports.dateNanosOrUndefined = exports.date = exports.byteOrUndefined = exports.byte = exports.booleanOrUndefined = exports.boolean = exports.binaryOrUndefined = exports.binary = exports._index = void 0;

var t = _interopRequireWildcard(require("io-ts"));

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== "function") return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function (nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache(nodeInterop);

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/* eslint-disable @typescript-eslint/naming-convention */


const binary = t.string;
exports.binary = binary;
const binaryOrUndefined = t.union([binary, t.undefined]);
exports.binaryOrUndefined = binaryOrUndefined;
const boolean = t.string;
exports.boolean = boolean;
const booleanOrUndefined = t.union([boolean, t.undefined]);
exports.booleanOrUndefined = booleanOrUndefined;
const byte = t.string;
exports.byte = byte;
const byteOrUndefined = t.union([byte, t.undefined]);
exports.byteOrUndefined = byteOrUndefined;
const date = t.string;
exports.date = date;
const dateOrUndefined = t.union([date, t.undefined]);
exports.dateOrUndefined = dateOrUndefined;
const date_nanos = t.string;
exports.date_nanos = date_nanos;
const dateNanosOrUndefined = t.union([date_nanos, t.undefined]);
exports.dateNanosOrUndefined = dateNanosOrUndefined;
const double = t.string;
exports.double = double;
const doubleOrUndefined = t.union([double, t.undefined]);
exports.doubleOrUndefined = doubleOrUndefined;
const float = t.string;
exports.float = float;
const floatOrUndefined = t.union([float, t.undefined]);
exports.floatOrUndefined = floatOrUndefined;
const geo_shape = t.string;
exports.geo_shape = geo_shape;
const geoShapeOrUndefined = t.union([geo_shape, t.undefined]);
exports.geoShapeOrUndefined = geoShapeOrUndefined;
const half_float = t.string;
exports.half_float = half_float;
const halfFloatOrUndefined = t.union([half_float, t.undefined]);
exports.halfFloatOrUndefined = halfFloatOrUndefined;
const integer = t.string;
exports.integer = integer;
const integerOrUndefined = t.union([integer, t.undefined]);
exports.integerOrUndefined = integerOrUndefined;
const ip = t.string;
exports.ip = ip;
const ipOrUndefined = t.union([ip, t.undefined]);
exports.ipOrUndefined = ipOrUndefined;
const keyword = t.string;
exports.keyword = keyword;
const keywordOrUndefined = t.union([keyword, t.undefined]);
exports.keywordOrUndefined = keywordOrUndefined;
const text = t.string;
exports.text = text;
const textOrUndefined = t.union([text, t.undefined]);
exports.textOrUndefined = textOrUndefined;
const long = t.string;
exports.long = long;
const longOrUndefined = t.union([long, t.undefined]);
exports.longOrUndefined = longOrUndefined;
const shape = t.string;
exports.shape = shape;
const shapeOrUndefined = t.union([shape, t.undefined]);
exports.shapeOrUndefined = shapeOrUndefined;
const short = t.string;
exports.short = short;
const shortOrUndefined = t.union([short, t.undefined]);
exports.shortOrUndefined = shortOrUndefined;
const esDataTypeRange = t.exact(t.type({
  gte: t.string,
  lte: t.string
}));
exports.esDataTypeRange = esDataTypeRange;
const date_range = esDataTypeRange;
exports.date_range = date_range;
const dateRangeOrUndefined = t.union([date_range, t.undefined]);
exports.dateRangeOrUndefined = dateRangeOrUndefined;
const double_range = esDataTypeRange;
exports.double_range = double_range;
const doubleRangeOrUndefined = t.union([double_range, t.undefined]);
exports.doubleRangeOrUndefined = doubleRangeOrUndefined;
const float_range = esDataTypeRange;
exports.float_range = float_range;
const floatRangeOrUndefined = t.union([float_range, t.undefined]);
exports.floatRangeOrUndefined = floatRangeOrUndefined;
const integer_range = esDataTypeRange;
exports.integer_range = integer_range;
const integerRangeOrUndefined = t.union([integer_range, t.undefined]); // ip_range can be just a CIDR value as a range

exports.integerRangeOrUndefined = integerRangeOrUndefined;
const ip_range = t.union([esDataTypeRange, t.string]);
exports.ip_range = ip_range;
const ipRangeOrUndefined = t.union([ip_range, t.undefined]);
exports.ipRangeOrUndefined = ipRangeOrUndefined;
const long_range = esDataTypeRange;
exports.long_range = long_range;
const longRangeOrUndefined = t.union([long_range, t.undefined]);
exports.longRangeOrUndefined = longRangeOrUndefined;
const esDataTypeRangeTerm = t.union([t.exact(t.type({
  date_range
})), t.exact(t.type({
  double_range
})), t.exact(t.type({
  float_range
})), t.exact(t.type({
  integer_range
})), t.exact(t.type({
  ip_range
})), t.exact(t.type({
  long_range
}))]);
exports.esDataTypeRangeTerm = esDataTypeRangeTerm;
const esDataTypeGeoPointRange = t.exact(t.type({
  lat: t.string,
  lon: t.string
}));
exports.esDataTypeGeoPointRange = esDataTypeGeoPointRange;
const geo_point = t.union([esDataTypeGeoPointRange, t.string]);
exports.geo_point = geo_point;
const geoPointOrUndefined = t.union([geo_point, t.undefined]);
exports.geoPointOrUndefined = geoPointOrUndefined;
const esDataTypeGeoPoint = t.exact(t.type({
  geo_point
}));
exports.esDataTypeGeoPoint = esDataTypeGeoPoint;
const esDataTypeGeoShape = t.union([t.exact(t.type({
  geo_shape: t.string
})), t.exact(t.type({
  shape: t.string
}))]);
exports.esDataTypeGeoShape = esDataTypeGeoShape;
const esDataTypeSingle = t.union([t.exact(t.type({
  binary
})), t.exact(t.type({
  boolean
})), t.exact(t.type({
  byte
})), t.exact(t.type({
  date
})), t.exact(t.type({
  date_nanos
})), t.exact(t.type({
  double
})), t.exact(t.type({
  float
})), t.exact(t.type({
  half_float
})), t.exact(t.type({
  integer
})), t.exact(t.type({
  ip
})), t.exact(t.type({
  keyword
})), t.exact(t.type({
  long
})), t.exact(t.type({
  short
})), t.exact(t.type({
  text
}))]);
exports.esDataTypeSingle = esDataTypeSingle;
const esDataTypeUnion = t.union([esDataTypeRangeTerm, esDataTypeGeoPoint, esDataTypeGeoShape, esDataTypeSingle]);
exports.esDataTypeUnion = esDataTypeUnion;
const _index = t.string;
exports._index = _index;