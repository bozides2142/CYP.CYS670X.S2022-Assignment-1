"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBulkOperationError = getBulkOperationError;
exports.getCurrentTime = getCurrentTime;
exports.getExpectedVersionProperties = getExpectedVersionProperties;
exports.getObjectKey = getObjectKey;
exports.getSavedObjectFromSource = getSavedObjectFromSource;
exports.isRight = exports.isLeft = void 0;
exports.normalizeNamespace = normalizeNamespace;
exports.parseObjectKey = parseObjectKey;
exports.rawDocExistsInNamespace = rawDocExistsInNamespace;
exports.rawDocExistsInNamespaces = rawDocExistsInNamespaces;

var _version = require("../../version");

var _errors = require("./errors");

var _utils = require("./utils");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Type guard for left part of discriminated union ({@link Left}, {@link Either}).
 * @internal
 */
const isLeft = either => either.tag === 'Left';
/**
 * Type guard for right part of discriminated union ({@link Right}, {@link Either}).
 * @internal
 */


exports.isLeft = isLeft;

const isRight = either => either.tag === 'Right';
/**
 * Checks the raw response of a bulk operation and returns an error if necessary.
 *
 * @param type
 * @param id
 * @param rawResponse
 *
 * @internal
 */


exports.isRight = isRight;

function getBulkOperationError(type, id, rawResponse) {
  const {
    status,
    error
  } = rawResponse;

  if (error) {
    switch (status) {
      case 404:
        return error.type === 'index_not_found_exception' ? _errors.SavedObjectsErrorHelpers.createIndexAliasNotFoundError(error.index).output.payload : _errors.SavedObjectsErrorHelpers.createGenericNotFoundError(type, id).output.payload;

      case 409:
        return _errors.SavedObjectsErrorHelpers.createConflictError(type, id).output.payload;

      default:
        return {
          error: 'Internal Server Error',
          message: `Unexpected bulk response [${status}] ${error.type}: ${error.reason}`,
          statusCode: 500
        };
    }
  }
}
/**
 * Returns an object with the expected version properties. This facilitates Elasticsearch's Optimistic Concurrency Control.
 *
 * @param version Optional version specified by the consumer.
 * @param document Optional existing document that was obtained in a preflight operation.
 *
 * @internal
 */


function getExpectedVersionProperties(version, document) {
  if (version) {
    return (0, _version.decodeRequestVersion)(version);
  } else if (document) {
    return {
      if_seq_no: document._seq_no,
      if_primary_term: document._primary_term
    };
  }

  return {};
}
/**
 * Gets a saved object from a raw ES document.
 *
 * @param registry
 * @param type
 * @param id
 * @param doc
 *
 * @internal
 */


function getSavedObjectFromSource(registry, type, id, doc) {
  const {
    originId,
    updated_at: updatedAt
  } = doc._source;
  let namespaces = [];

  if (!registry.isNamespaceAgnostic(type)) {
    var _doc$_source$namespac;

    namespaces = (_doc$_source$namespac = doc._source.namespaces) !== null && _doc$_source$namespac !== void 0 ? _doc$_source$namespac : [_utils.SavedObjectsUtils.namespaceIdToString(doc._source.namespace)];
  }

  return {
    id,
    type,
    namespaces,
    ...(originId && {
      originId
    }),
    ...(updatedAt && {
      updated_at: updatedAt
    }),
    version: (0, _version.encodeHitVersion)(doc),
    attributes: doc._source[type],
    references: doc._source.references || [],
    migrationVersion: doc._source.migrationVersion,
    coreMigrationVersion: doc._source.coreMigrationVersion
  };
}
/**
 * Check to ensure that a raw document exists in a namespace. If the document is not a multi-namespace type, then this returns `true` as
 * we rely on the guarantees of the document ID format. If the document is a multi-namespace type, this checks to ensure that the
 * document's `namespaces` value includes the string representation of the given namespace.
 *
 * WARNING: This should only be used for documents that were retrieved from Elasticsearch. Otherwise, the guarantees of the document ID
 * format mentioned above do not apply.
 *
 * @param registry
 * @param raw
 * @param namespace
 *
 * @internal
 */


function rawDocExistsInNamespace(registry, raw, namespace) {
  const rawDocType = raw._source.type; // if the type is namespace isolated, or namespace agnostic, we can continue to rely on the guarantees
  // of the document ID format and don't need to check this

  if (!registry.isMultiNamespace(rawDocType)) {
    return true;
  }

  const namespaces = raw._source.namespaces;
  const existsInNamespace = (namespaces === null || namespaces === void 0 ? void 0 : namespaces.includes(_utils.SavedObjectsUtils.namespaceIdToString(namespace))) || (namespaces === null || namespaces === void 0 ? void 0 : namespaces.includes(_utils.ALL_NAMESPACES_STRING));
  return existsInNamespace !== null && existsInNamespace !== void 0 ? existsInNamespace : false;
}
/**
 * Check to ensure that a raw document exists in at least one of the given namespaces. If the document is not a multi-namespace type, then
 * this returns `true` as we rely on the guarantees of the document ID format. If the document is a multi-namespace type, this checks to
 * ensure that the document's `namespaces` value includes the string representation of at least one of the given namespaces.
 *
 * WARNING: This should only be used for documents that were retrieved from Elasticsearch. Otherwise, the guarantees of the document ID
 * format mentioned above do not apply.
 *
 * @param registry
 * @param raw
 * @param namespaces
 *
 * @internal
 */


function rawDocExistsInNamespaces(registry, raw, namespaces) {
  var _raw$_source$namespac;

  const rawDocType = raw._source.type; // if the type is namespace isolated, or namespace agnostic, we can continue to rely on the guarantees
  // of the document ID format and don't need to check this

  if (!registry.isMultiNamespace(rawDocType)) {
    return true;
  }

  const namespacesToCheck = new Set(namespaces);
  const existingNamespaces = (_raw$_source$namespac = raw._source.namespaces) !== null && _raw$_source$namespac !== void 0 ? _raw$_source$namespac : [];

  if (namespacesToCheck.size === 0 || existingNamespaces.length === 0) {
    return false;
  }

  if (namespacesToCheck.has(_utils.ALL_NAMESPACES_STRING)) {
    return true;
  }

  return existingNamespaces.some(x => x === _utils.ALL_NAMESPACES_STRING || namespacesToCheck.has(x));
}
/**
 * Ensure that a namespace is always in its namespace ID representation.
 * This allows `'default'` to be used interchangeably with `undefined`.
 *
 * @param namespace
 *
 * @internal
 */


function normalizeNamespace(namespace) {
  if (namespace === _utils.ALL_NAMESPACES_STRING) {
    throw _errors.SavedObjectsErrorHelpers.createBadRequestError('"options.namespace" cannot be "*"');
  } else if (namespace === undefined) {
    return namespace;
  } else {
    return _utils.SavedObjectsUtils.namespaceStringToId(namespace);
  }
}
/**
 * Returns the current time. For use in Elasticsearch operations.
 *
 * @internal
 */


function getCurrentTime() {
  return new Date(Date.now()).toISOString();
}
/**
 * Takes an object with a `type` and `id` field and returns a key string.
 *
 * @internal
 */


function getObjectKey({
  type,
  id
}) {
  return `${type}:${id}`;
}
/**
 * Parses a 'type:id' key string and returns an object with a `type` field and an `id` field.
 *
 * @internal
 */


function parseObjectKey(key) {
  const type = key.slice(0, key.indexOf(':'));
  const id = key.slice(type.length + 1);

  if (!type || !id) {
    throw new Error('Malformed object key (should be "type:id")');
  }

  return {
    type,
    id
  };
}