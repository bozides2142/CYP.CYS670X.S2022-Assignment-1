"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ALIAS_SEARCH_PER_PAGE = void 0;
exports.preflightCheckForCreate = preflightCheckForCreate;

var _elasticsearch = require("../../../elasticsearch");

var _object_types = require("../../object_types");

var _legacy_url_aliases = require("./legacy_url_aliases");

var _internal_utils = require("./internal_utils");

var _utils = require("./utils");

var _errors = require("./errors");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * If the object will be created in this many spaces (or "*" all current and future spaces), we use find to fetch all aliases.
 * If the object does not exceed this threshold, we use mget to fetch aliases instead.
 * This threshold is a bit arbitrary, but it is intended to optimize so we don't make expensive PIT/find operations unless it is necessary.
 */
const FIND_ALIASES_THRESHOLD = 3;
/**
 * How many aliases to search for per page. This is 1000 because consumers are relatively important operations and we could potentially be
 * paging through many thousands of results.
 *
 * @internal
 */

const ALIAS_SEARCH_PER_PAGE = 1000;
exports.ALIAS_SEARCH_PER_PAGE = ALIAS_SEARCH_PER_PAGE;

function isMgetDoc(doc) {
  return Boolean(doc && 'found' in doc);
}
/**
 * Conducts pre-flight checks before object creation. Consumers should only check eligible objects (multi-namespace types).
 * For each object that the consumer intends to create, we check for three potential error cases in all applicable spaces:
 *
 *  1. 'aliasConflict' - there is already an alias that points to a different object.
 *  2. 'unresolvableConflict' - this object already exists in a different space and it cannot be overwritten with the given parameters.
 *  3. 'conflict' - this object already exists (and the given options include `overwrite=false`).
 *
 * Objects can be created in 1-N spaces, and for each object+space combination we need to check if a legacy URL alias exists. This function
 * attempts to optimize by defining an "alias threshold"; if we need to check for more aliases than that threshold, instead of attempting to
 * bulk-get each one, we find (search for) them. This is intended to strike an acceptable balance of performance, and is necessary when
 * creating objects in "*" (all current and future spaces) because we don't want to attempt to enumerate all spaces here.
 *
 * @param objects The objects that the consumer intends to create.
 *
 * @internal
 */


async function preflightCheckForCreate(params) {
  const {
    registry,
    client,
    serializer,
    getIndexForType,
    createPointInTimeFinder,
    objects
  } = params; // Step 1: for each object, check if it is over the potential alias threshold; if so, attempt to search for aliases that may be affected.
  // The result is a discriminated union: the left side is 'aliasConflict' errors, and the right side is objects/aliases to bulk-get.

  const aliasConflictsOrObjectsToGet = await optionallyFindAliases(createPointInTimeFinder, objects); // Step 2: bulk-get all objects and aliases.

  const objectsAndAliasesToBulkGet = aliasConflictsOrObjectsToGet.filter(_internal_utils.isRight).map(({
    value
  }) => value);
  const {
    bulkGetResponse,
    aliasSpaces
  } = await bulkGetObjectsAndAliases(client, serializer, getIndexForType, objectsAndAliasesToBulkGet); // Step 3: process all of the find and bulk-get results, and return appropriate results to the consumer.

  let getResponseIndex = 0;
  let aliasSpacesIndex = 0;
  const results = [];

  for (const either of aliasConflictsOrObjectsToGet) {
    if ((0, _internal_utils.isLeft)(either)) {
      const {
        type,
        id,
        spacesWithConflictingAliases
      } = either.value;
      const error = {
        type: 'aliasConflict',
        metadata: {
          spacesWithConflictingAliases
        }
      };
      results.push({
        type,
        id,
        error
      });
    } else {
      const {
        type,
        id,
        spaces,
        overwrite,
        checkAliases
      } = either.value;
      const objectDoc = bulkGetResponse === null || bulkGetResponse === void 0 ? void 0 : bulkGetResponse.body.docs[getResponseIndex++];

      if (checkAliases) {
        const spacesWithConflictingAliases = [];

        for (let i = 0; i < spaces.size; i++) {
          const aliasDoc = bulkGetResponse === null || bulkGetResponse === void 0 ? void 0 : bulkGetResponse.body.docs[getResponseIndex++];
          const index = aliasSpacesIndex++; // increment whether the alias was found or not

          if (isMgetDoc(aliasDoc) && aliasDoc.found) {
            const legacyUrlAlias = aliasDoc._source[_object_types.LEGACY_URL_ALIAS_TYPE]; // if the 'disabled' field is not present, the source will be empty

            if (!(legacyUrlAlias !== null && legacyUrlAlias !== void 0 && legacyUrlAlias.disabled)) {
              // the alias was found, so the space we checked in has a conflicting alias
              // in case the space in the alias's raw ID does not match the space in its sourceSpace field, prefer the former
              spacesWithConflictingAliases.push(aliasSpaces[index]);
            }
          }
        }

        if (spacesWithConflictingAliases.length) {
          const error = {
            type: 'aliasConflict',
            metadata: {
              spacesWithConflictingAliases
            }
          };
          results.push({
            type,
            id,
            error
          });
          continue;
        }
      }

      let existingDocument;

      if (isMgetDoc(objectDoc) && objectDoc.found) {
        // @ts-expect-error MultiGetHit._source is optional
        if (!(0, _internal_utils.rawDocExistsInNamespaces)(registry, objectDoc, [...spaces])) {
          const error = {
            type: 'unresolvableConflict',
            metadata: {
              isNotOverwritable: true
            }
          };
          results.push({
            type,
            id,
            error
          });
          continue;
        } else if (!overwrite) {
          const error = {
            type: 'conflict'
          };
          results.push({
            type,
            id,
            error
          });
          continue;
        }

        existingDocument = objectDoc;
      }

      results.push({
        type,
        id,
        existingDocument
      });
    }
  }

  return results;
}

async function optionallyFindAliases(createPointInTimeFinder, objects) {
  // Make a discriminated union based on the spaces the objects should be created in (Left=mget aliases, Right=find aliases)
  const objectsToGetOrObjectsToFind = objects.map(object => {
    const {
      type,
      id,
      namespaces,
      overwrite = false
    } = object;
    const spaces = new Set(namespaces);
    const tag = spaces.size > FIND_ALIASES_THRESHOLD || spaces.has(_utils.ALL_NAMESPACES_STRING) ? 'Right' : 'Left';
    return {
      tag,
      value: {
        type,
        id,
        overwrite,
        spaces
      }
    };
  });
  const objectsToFind = objectsToGetOrObjectsToFind.filter(_internal_utils.isRight).map(({
    value: {
      type,
      id
    }
  }) => ({
    type,
    id
  }));
  const aliasMap = await (0, _legacy_url_aliases.findLegacyUrlAliases)(createPointInTimeFinder, objectsToFind, ALIAS_SEARCH_PER_PAGE); // Make another discriminated union based on the find results (Left=error, Right=mget objects/aliases)

  const result = objectsToGetOrObjectsToFind.map(either => {
    let checkAliases = true;

    if ((0, _internal_utils.isRight)(either)) {
      const {
        type,
        id,
        spaces
      } = either.value;
      const key = (0, _internal_utils.getObjectKey)({
        type,
        id
      });
      const spacesWithMatchingAliases = aliasMap.get(key);

      if (spacesWithMatchingAliases) {
        let spacesWithConflictingAliases = [];

        if (spaces.has(_utils.ALL_NAMESPACES_STRING)) {
          spacesWithConflictingAliases = [...spacesWithMatchingAliases];
        } else {
          spacesWithConflictingAliases = intersection(spaces, spacesWithMatchingAliases);
        }

        if (spacesWithConflictingAliases.length) {
          // we found one or more conflicting aliases, this is an error result
          return {
            tag: 'Left',
            value: { ...either.value,
              spacesWithConflictingAliases
            }
          };
        }
      } // we checked for aliases but did not detect any conflicts; make sure we don't check for aliases again during mget


      checkAliases = false;
    }

    return {
      tag: 'Right',
      value: { ...either.value,
        checkAliases
      }
    };
  });
  return result;
}

async function bulkGetObjectsAndAliases(client, serializer, getIndexForType, objectsAndAliasesToBulkGet) {
  const docsToBulkGet = [];
  const aliasSpaces = [];

  for (const {
    type,
    id,
    spaces,
    checkAliases
  } of objectsAndAliasesToBulkGet) {
    docsToBulkGet.push({
      _id: serializer.generateRawId(undefined, type, id),
      // namespace is intentionally undefined because multi-namespace objects don't have a namespace in their raw ID
      _index: getIndexForType(type),
      _source: ['type', 'namespaces']
    });

    if (checkAliases) {
      for (const space of spaces) {
        const rawAliasId = serializer.generateRawLegacyUrlAliasId(space, type, id);
        docsToBulkGet.push({
          _id: rawAliasId,
          _index: getIndexForType(_object_types.LEGACY_URL_ALIAS_TYPE),
          _source: [`${_object_types.LEGACY_URL_ALIAS_TYPE}.disabled`]
        });
        aliasSpaces.push(space);
      }
    }
  }

  const bulkGetResponse = docsToBulkGet.length ? await client.mget({
    body: {
      docs: docsToBulkGet
    }
  }, {
    ignore: [404]
  }) : undefined; // throw if we can't verify a 404 response is from Elasticsearch

  if (bulkGetResponse && (0, _elasticsearch.isNotFoundFromUnsupportedServer)({
    statusCode: bulkGetResponse.statusCode,
    headers: bulkGetResponse.headers
  })) {
    throw _errors.SavedObjectsErrorHelpers.createGenericNotFoundEsUnavailableError();
  }

  return {
    bulkGetResponse,
    aliasSpaces
  };
}

function intersection(a, b) {
  const result = [];

  for (const x of a) {
    if (b.has(x)) {
      result.push(x);
    }
  }

  return result;
}