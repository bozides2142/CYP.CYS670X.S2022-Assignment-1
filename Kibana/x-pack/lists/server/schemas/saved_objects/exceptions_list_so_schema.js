"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.exceptionListSoSchema = void 0;

var t = _interopRequireWildcard(require("io-ts"));

var _securitysolutionIoTsListTypes = require("@kbn/securitysolution-io-ts-list-types");

var _securitysolutionIoTsTypes = require("@kbn/securitysolution-io-ts-types");

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

/**
 * Superset saved object of both lists and list items since they share the same saved object type.
 */


const exceptionListSoSchema = t.exact(t.type({
  comments: _securitysolutionIoTsListTypes.commentsArrayOrUndefined,
  created_at: _securitysolutionIoTsListTypes.created_at,
  created_by: _securitysolutionIoTsListTypes.created_by,
  description: _securitysolutionIoTsListTypes.description,
  entries: _securitysolutionIoTsListTypes.entriesArrayOrUndefined,
  immutable: _securitysolutionIoTsListTypes.immutableOrUndefined,
  item_id: _securitysolutionIoTsListTypes.itemIdOrUndefined,
  list_id: _securitysolutionIoTsListTypes.list_id,
  list_type: _securitysolutionIoTsListTypes.list_type,
  meta: _securitysolutionIoTsListTypes.metaOrUndefined,
  name: _securitysolutionIoTsListTypes.name,
  os_types: _securitysolutionIoTsListTypes.osTypeArray,
  tags: _securitysolutionIoTsListTypes.tags,
  tie_breaker_id: _securitysolutionIoTsListTypes.tie_breaker_id,
  type: t.union([_securitysolutionIoTsListTypes.exceptionListType, _securitysolutionIoTsListTypes.exceptionListItemType]),
  updated_by: _securitysolutionIoTsListTypes.updated_by,
  version: _securitysolutionIoTsTypes.versionOrUndefined
}));
exports.exceptionListSoSchema = exceptionListSoSchema;