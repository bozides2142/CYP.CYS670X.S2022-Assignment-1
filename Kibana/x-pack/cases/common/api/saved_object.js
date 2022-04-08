"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SavedObjectFindOptionsRt = exports.NumberFromString = void 0;

var rt = _interopRequireWildcard(require("io-ts"));

var _Either = require("fp-ts/lib/Either");

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


const NumberFromString = new rt.Type('NumberFromString', rt.number.is, (u, c) => _Either.either.chain(rt.string.validate(u, c), s => {
  const n = +s;
  return isNaN(n) ? rt.failure(u, c, 'cannot parse to a number') : rt.success(n);
}), String);
exports.NumberFromString = NumberFromString;
const ReferenceRt = rt.type({
  id: rt.string,
  type: rt.string
});
const SavedObjectFindOptionsRt = rt.partial({
  /**
   * The default operator to use for the simple_query_string
   */
  defaultSearchOperator: rt.union([rt.literal('AND'), rt.literal('OR')]),

  /**
   * The operator for controlling the logic of the `hasReference` field
   */
  hasReferenceOperator: rt.union([rt.literal('AND'), rt.literal('OR')]),

  /**
   * Filter by objects that have an association to another object
   */
  hasReference: rt.union([rt.array(ReferenceRt), ReferenceRt]),

  /**
   * The fields to return in the attributes key of the response
   */
  fields: rt.array(rt.string),

  /**
   * The filter is a KQL string with the caveat that if you filter with an attribute from your saved object type, it should look like that: savedObjectType.attributes.title: "myTitle". However, If you use a root attribute of a saved object such as updated_at, you will have to define your filter like that: savedObjectType.updated_at > 2018-12-22
   */
  filter: rt.string,

  /**
   * The page of objects to return
   */
  page: NumberFromString,

  /**
   * The number of objects to return for a page
   */
  perPage: NumberFromString,

  /**
   * An Elasticsearch simple_query_string query that filters the objects in the response
   */
  search: rt.string,

  /**
   * The fields to perform the simple_query_string parsed query against
   */
  searchFields: rt.array(rt.string),

  /**
   * Sorts the response. Includes "root" and "type" fields. "root" fields exist for all saved objects, such as "updated_at". "type" fields are specific to an object type, such as fields returned in the attributes key of the response. When a single type is defined in the type parameter, the "root" and "type" fields are allowed, and validity checks are made in that order. When multiple types are defined in the type parameter, only "root" fields are allowed
   */
  sortField: rt.string,

  /**
   * Order to sort the response
   */
  sortOrder: rt.union([rt.literal('desc'), rt.literal('asc')])
});
exports.SavedObjectFindOptionsRt = SavedObjectFindOptionsRt;