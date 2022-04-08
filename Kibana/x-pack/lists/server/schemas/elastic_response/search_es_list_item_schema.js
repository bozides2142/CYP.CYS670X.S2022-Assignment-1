"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.searchEsListItemSchema = void 0;

var t = _interopRequireWildcard(require("io-ts"));

var _securitysolutionIoTsListTypes = require("@kbn/securitysolution-io-ts-list-types");

var _schemas = require("../common/schemas");

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


const searchEsListItemSchema = t.exact(t.type({
  binary: _schemas.binaryOrUndefined,
  boolean: _schemas.booleanOrUndefined,
  byte: _schemas.byteOrUndefined,
  created_at: _securitysolutionIoTsListTypes.created_at,
  created_by: _securitysolutionIoTsListTypes.created_by,
  date: _schemas.dateOrUndefined,
  date_nanos: _schemas.dateNanosOrUndefined,
  date_range: _schemas.dateRangeOrUndefined,
  deserializer: _securitysolutionIoTsListTypes.deserializerOrUndefined,
  double: _schemas.doubleOrUndefined,
  double_range: _schemas.doubleRangeOrUndefined,
  float: _schemas.floatOrUndefined,
  float_range: _schemas.floatRangeOrUndefined,
  geo_point: _schemas.geoPointOrUndefined,
  geo_shape: _schemas.geoShapeOrUndefined,
  half_float: _schemas.halfFloatOrUndefined,
  integer: _schemas.integerOrUndefined,
  integer_range: _schemas.integerRangeOrUndefined,
  ip: _schemas.ipOrUndefined,
  ip_range: _schemas.ipRangeOrUndefined,
  keyword: _schemas.keywordOrUndefined,
  list_id: _securitysolutionIoTsListTypes.list_id,
  long: _schemas.longOrUndefined,
  long_range: _schemas.longRangeOrUndefined,
  meta: _securitysolutionIoTsListTypes.metaOrUndefined,
  serializer: _securitysolutionIoTsListTypes.serializerOrUndefined,
  shape: _schemas.shapeOrUndefined,
  short: _schemas.shortOrUndefined,
  text: _schemas.textOrUndefined,
  tie_breaker_id: _securitysolutionIoTsListTypes.tie_breaker_id,
  updated_at: _securitysolutionIoTsListTypes.updated_at,
  updated_by: _securitysolutionIoTsListTypes.updated_by
}));
exports.searchEsListItemSchema = searchEsListItemSchema;