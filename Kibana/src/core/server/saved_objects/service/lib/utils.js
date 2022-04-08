"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SavedObjectsUtils = exports.FIND_DEFAULT_PER_PAGE = exports.FIND_DEFAULT_PAGE = exports.DEFAULT_NAMESPACE_STRING = exports.ALL_NAMESPACES_STRING = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _v = _interopRequireDefault(require("uuid/v1"));

var _v2 = _interopRequireDefault(require("uuid/v5"));

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const DEFAULT_NAMESPACE_STRING = 'default';
exports.DEFAULT_NAMESPACE_STRING = DEFAULT_NAMESPACE_STRING;
const ALL_NAMESPACES_STRING = '*';
exports.ALL_NAMESPACES_STRING = ALL_NAMESPACES_STRING;
const FIND_DEFAULT_PAGE = 1;
exports.FIND_DEFAULT_PAGE = FIND_DEFAULT_PAGE;
const FIND_DEFAULT_PER_PAGE = 20;
exports.FIND_DEFAULT_PER_PAGE = FIND_DEFAULT_PER_PAGE;
const UUID_REGEX = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
/**
 * @public
 */

class SavedObjectsUtils {
  /**
   * Converts a given saved object namespace ID to its string representation. All namespace IDs have an identical string representation, with
   * the exception of the `undefined` namespace ID (which has a namespace string of `'default'`).
   *
   * @param namespace The namespace ID, which must be either a non-empty string or `undefined`.
   */

  /**
   * Converts a given saved object namespace string to its ID representation. All namespace strings have an identical ID representation, with
   * the exception of the `'default'` namespace string (which has a namespace ID of `undefined`).
   *
   * @param namespace The namespace string, which must be non-empty.
   */

  /**
   * Creates an empty response for a find operation. This is only intended to be used by saved objects client wrappers.
   */

  /**
   * Generates a random ID for a saved objects.
   */
  static generateId() {
    return (0, _v.default)();
  }
  /**
   * Validates that a saved object ID has been randomly generated.
   *
   * @param {string} id The ID of a saved object.
   * @todo Use `uuid.validate` once upgraded to v5.3+
   */


  static isRandomId(id) {
    return typeof id === 'string' && UUID_REGEX.test(id);
  }
  /**
   * Uses a single-namespace object's "legacy ID" to determine what its new ID will be after it is converted to a multi-namespace type.
   *
   * @param {string} namespace The namespace of the saved object before it is converted.
   * @param {string} type The type of the saved object before it is converted.
   * @param {string} id The ID of the saved object before it is converted.
   * @returns {string} The ID of the saved object after it is converted.
   */


  static getConvertedObjectId(namespace, type, id) {
    if (SavedObjectsUtils.namespaceIdToString(namespace) === DEFAULT_NAMESPACE_STRING) {
      return id; // Objects that exist in the Default space do not get new IDs when they are converted.
    }

    return (0, _v2.default)(`${namespace}:${type}:${id}`, _v2.default.DNS); // The uuidv5 namespace constant (uuidv5.DNS) is arbitrary.
  }

}

exports.SavedObjectsUtils = SavedObjectsUtils;
(0, _defineProperty2.default)(SavedObjectsUtils, "namespaceIdToString", namespace => {
  if (namespace === '') {
    throw new TypeError('namespace cannot be an empty string');
  }

  return namespace !== null && namespace !== void 0 ? namespace : DEFAULT_NAMESPACE_STRING;
});
(0, _defineProperty2.default)(SavedObjectsUtils, "namespaceStringToId", namespace => {
  if (!namespace) {
    throw new TypeError('namespace must be a non-empty string');
  }

  return namespace !== DEFAULT_NAMESPACE_STRING ? namespace : undefined;
});
(0, _defineProperty2.default)(SavedObjectsUtils, "createEmptyFindResponse", ({
  page = FIND_DEFAULT_PAGE,
  perPage = FIND_DEFAULT_PER_PAGE
}) => ({
  page,
  per_page: perPage,
  total: 0,
  saved_objects: []
}));