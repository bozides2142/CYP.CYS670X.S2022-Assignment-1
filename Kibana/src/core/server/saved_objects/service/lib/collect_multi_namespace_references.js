"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ALIAS_SEARCH_PER_PAGE = void 0;
exports.collectMultiNamespaceReferences = collectMultiNamespaceReferences;

var _elasticsearch = require("../../../elasticsearch");

var _errors = require("./errors");

var _legacy_url_aliases = require("./legacy_url_aliases");

var _included_fields = require("./included_fields");

var _internal_utils = require("./internal_utils");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * When we collect an object's outbound references, we will only go a maximum of this many levels deep before we throw an error.
 */
const MAX_REFERENCE_GRAPH_DEPTH = 20;
/**
 * How many aliases to search for per page. This is smaller than the PointInTimeFinder's default of 1000. We specify 100 for the page count
 * because this is a relatively unimportant operation, and we want to avoid blocking the Elasticsearch thread pool for longer than
 * necessary.
 *
 * @internal
 */

const ALIAS_SEARCH_PER_PAGE = 100;
/**
 * An object to collect references for. It must be a multi-namespace type (in other words, the object type must be registered with the
 * `namespaceType: 'multiple'` or `namespaceType: 'multiple-isolated'` option).
 *
 * Note: if options.purpose is 'updateObjectsSpaces', it must be a shareable type (in other words, the object type must be registered with
 * the `namespaceType: 'multiple'`).
 *
 * @public
 */

exports.ALIAS_SEARCH_PER_PAGE = ALIAS_SEARCH_PER_PAGE;

/**
 * Gets all references and transitive references of the given objects. Ignores any object and/or reference that is not a multi-namespace
 * type.
 *
 * @internal
 */
async function collectMultiNamespaceReferences(params) {
  const {
    createPointInTimeFinder,
    objects
  } = params;

  if (!objects.length) {
    return {
      objects: []
    };
  }

  const {
    objectMap,
    inboundReferencesMap
  } = await getObjectsAndReferences(params);
  const objectsWithContext = Array.from(inboundReferencesMap.entries()).map(([referenceKey, referenceVal]) => {
    var _object$namespaces;

    const inboundReferences = Array.from(referenceVal.entries()).map(([objectKey, name]) => {
      const {
        type,
        id
      } = (0, _internal_utils.parseObjectKey)(objectKey);
      return {
        type,
        id,
        name
      };
    });
    const {
      type,
      id
    } = (0, _internal_utils.parseObjectKey)(referenceKey);
    const object = objectMap.get(referenceKey);
    const spaces = (_object$namespaces = object === null || object === void 0 ? void 0 : object.namespaces) !== null && _object$namespaces !== void 0 ? _object$namespaces : [];
    return {
      type,
      id,
      spaces,
      inboundReferences,
      ...(object === null && {
        isMissing: true
      })
    };
  });
  const objectsToFindAliasesFor = objectsWithContext.filter(({
    spaces
  }) => spaces.length !== 0).map(({
    type,
    id
  }) => ({
    type,
    id
  }));
  const aliasesMap = await (0, _legacy_url_aliases.findLegacyUrlAliases)(createPointInTimeFinder, objectsToFindAliasesFor, ALIAS_SEARCH_PER_PAGE);
  const results = objectsWithContext.map(obj => {
    const key = (0, _internal_utils.getObjectKey)(obj);
    const val = aliasesMap.get(key);
    const spacesWithMatchingAliases = val && Array.from(val);
    return { ...obj,
      spacesWithMatchingAliases
    };
  });
  return {
    objects: results
  };
}
/**
 * Recursively fetches objects and their references, returning a map of the retrieved objects and a map of all inbound references.
 */


async function getObjectsAndReferences({
  registry,
  allowedTypes,
  client,
  serializer,
  getIndexForType,
  objects,
  options = {}
}) {
  const {
    namespace,
    purpose
  } = options;
  const inboundReferencesMap = objects.reduce( // Add the input objects to the references map so they are returned with the results, even if they have no inbound references
  (acc, cur) => acc.set((0, _internal_utils.getObjectKey)(cur), new Map()), new Map());
  const objectMap = new Map();
  const rootFields = (0, _included_fields.getRootFields)();

  const makeBulkGetDocs = objectsToGet => objectsToGet.map(({
    type,
    id
  }) => ({
    _id: serializer.generateRawId(undefined, type, id),
    _index: getIndexForType(type),
    _source: rootFields // Optimized to only retrieve root fields (ignoring type-specific fields)

  }));

  const validObjectTypesFilter = ({
    type
  }) => allowedTypes.includes(type) && (purpose === 'updateObjectsSpaces' ? registry.isShareable(type) : registry.isMultiNamespace(type));

  let bulkGetObjects = objects.filter(validObjectTypesFilter);
  let count = 0; // this is a circuit-breaker to ensure we don't hog too many resources; we should never have an object graph this deep

  while (bulkGetObjects.length) {
    if (count >= MAX_REFERENCE_GRAPH_DEPTH) {
      throw new Error(`Exceeded maximum reference graph depth of ${MAX_REFERENCE_GRAPH_DEPTH} objects!`);
    }

    const bulkGetResponse = await client.mget({
      body: {
        docs: makeBulkGetDocs(bulkGetObjects)
      }
    }, {
      ignore: [404]
    }); // exit early if we can't verify a 404 response is from Elasticsearch

    if ((0, _elasticsearch.isNotFoundFromUnsupportedServer)({
      statusCode: bulkGetResponse.statusCode,
      headers: bulkGetResponse.headers
    })) {
      throw _errors.SavedObjectsErrorHelpers.createGenericNotFoundEsUnavailableError();
    }

    const newObjectsToGet = new Set();

    for (let i = 0; i < bulkGetObjects.length; i++) {
      // For every element in bulkGetObjects, there should be a matching element in bulkGetResponse.body.docs
      const {
        type,
        id
      } = bulkGetObjects[i];
      const objectKey = (0, _internal_utils.getObjectKey)({
        type,
        id
      });
      const doc = bulkGetResponse.body.docs[i]; // @ts-expect-error MultiGetHit._source is optional

      if (!doc.found || !(0, _internal_utils.rawDocExistsInNamespace)(registry, doc, namespace)) {
        objectMap.set(objectKey, null);
        continue;
      } // @ts-expect-error MultiGetHit._source is optional


      const object = (0, _internal_utils.getSavedObjectFromSource)(registry, type, id, doc);
      objectMap.set(objectKey, object);

      for (const reference of object.references) {
        var _inboundReferencesMap;

        if (!validObjectTypesFilter(reference)) {
          continue;
        }

        const referenceKey = (0, _internal_utils.getObjectKey)(reference);
        const referenceVal = (_inboundReferencesMap = inboundReferencesMap.get(referenceKey)) !== null && _inboundReferencesMap !== void 0 ? _inboundReferencesMap : new Map();

        if (!referenceVal.has(objectKey)) {
          inboundReferencesMap.set(referenceKey, referenceVal.set(objectKey, reference.name));
        }

        if (!objectMap.has(referenceKey)) {
          newObjectsToGet.add(referenceKey);
        }
      }
    }

    bulkGetObjects = Array.from(newObjectsToGet).map(key => (0, _internal_utils.parseObjectKey)(key));
    count++;
  }

  return {
    objectMap,
    inboundReferencesMap
  };
}