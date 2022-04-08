"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateObjectsSpaces = updateObjectsSpaces;

var _pMap = _interopRequireDefault(require("p-map"));

var _intersection = _interopRequireDefault(require("lodash/intersection"));

var _elasticsearch = require("../../../elasticsearch");

var _errors = require("./errors");

var _internal_utils = require("./internal_utils");

var _repository = require("./repository");

var _utils = require("./utils");

var _legacy_url_aliases = require("./legacy_url_aliases");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const MAX_CONCURRENT_ALIAS_DELETIONS = 10;

function isMgetError(doc) {
  return Boolean(doc && 'error' in doc);
}
/**
 * Gets all references and transitive references of the given objects. Ignores any object and/or reference that is not a multi-namespace
 * type.
 */


async function updateObjectsSpaces({
  mappings,
  registry,
  allowedTypes,
  client,
  serializer,
  logger,
  getIndexForType,
  objects,
  spacesToAdd,
  spacesToRemove,
  options = {}
}) {
  if (!spacesToAdd.length && !spacesToRemove.length) {
    throw _errors.SavedObjectsErrorHelpers.createBadRequestError('spacesToAdd and/or spacesToRemove must be a non-empty array of strings');
  }

  if ((0, _intersection.default)(spacesToAdd, spacesToRemove).length > 0) {
    throw _errors.SavedObjectsErrorHelpers.createBadRequestError('spacesToAdd and spacesToRemove cannot contain any of the same strings');
  }

  const {
    namespace
  } = options;
  let bulkGetRequestIndexCounter = 0;
  const expectedBulkGetResults = objects.map(object => {
    const {
      type,
      id,
      spaces,
      version
    } = object;

    if (!allowedTypes.includes(type)) {
      const error = errorContent(_errors.SavedObjectsErrorHelpers.createGenericNotFoundError(type, id));
      return {
        tag: 'Left',
        value: {
          id,
          type,
          spaces: [],
          error
        }
      };
    }

    if (!registry.isShareable(type)) {
      const error = errorContent(_errors.SavedObjectsErrorHelpers.createBadRequestError(`${type} doesn't support multiple namespaces`));
      return {
        tag: 'Left',
        value: {
          id,
          type,
          spaces: [],
          error
        }
      };
    }

    return {
      tag: 'Right',
      value: {
        type,
        id,
        spaces,
        version,
        ...(!spaces && {
          esRequestIndex: bulkGetRequestIndexCounter++
        })
      }
    };
  });
  const bulkGetDocs = expectedBulkGetResults.reduce((acc, x) => {
    if ((0, _internal_utils.isRight)(x) && x.value.esRequestIndex !== undefined) {
      acc.push({
        _id: serializer.generateRawId(undefined, x.value.type, x.value.id),
        _index: getIndexForType(x.value.type),
        _source: ['type', 'namespaces']
      });
    }

    return acc;
  }, []);
  const bulkGetResponse = bulkGetDocs.length ? await client.mget({
    body: {
      docs: bulkGetDocs
    }
  }, {
    ignore: [404]
  }) : undefined; // fail fast if we can't verify a 404 response is from Elasticsearch

  if (bulkGetResponse && (0, _elasticsearch.isNotFoundFromUnsupportedServer)({
    statusCode: bulkGetResponse.statusCode,
    headers: bulkGetResponse.headers
  })) {
    throw _errors.SavedObjectsErrorHelpers.createGenericNotFoundEsUnavailableError();
  }

  const time = new Date().toISOString();
  let bulkOperationRequestIndexCounter = 0;
  const bulkOperationParams = [];
  const objectsToDeleteAliasesFor = [];
  const expectedBulkOperationResults = expectedBulkGetResults.map(expectedBulkGetResult => {
    if ((0, _internal_utils.isLeft)(expectedBulkGetResult)) {
      return expectedBulkGetResult;
    }

    const {
      id,
      type,
      spaces,
      version,
      esRequestIndex
    } = expectedBulkGetResult.value;
    let currentSpaces = spaces;
    let versionProperties;

    if (esRequestIndex !== undefined) {
      var _doc$_source$namespac, _doc$_source;

      const doc = bulkGetResponse === null || bulkGetResponse === void 0 ? void 0 : bulkGetResponse.body.docs[esRequestIndex];
      const isErrorDoc = isMgetError(doc);

      if (isErrorDoc || !(doc !== null && doc !== void 0 && doc.found) || // @ts-expect-error MultiGetHit._source is optional
      !(0, _internal_utils.rawDocExistsInNamespace)(registry, doc, namespace)) {
        const error = errorContent(_errors.SavedObjectsErrorHelpers.createGenericNotFoundError(type, id));
        return {
          tag: 'Left',
          value: {
            id,
            type,
            spaces: [],
            error
          }
        };
      }

      currentSpaces = (_doc$_source$namespac = (_doc$_source = doc._source) === null || _doc$_source === void 0 ? void 0 : _doc$_source.namespaces) !== null && _doc$_source$namespac !== void 0 ? _doc$_source$namespac : []; // @ts-expect-error MultiGetHit._source is optional

      versionProperties = (0, _internal_utils.getExpectedVersionProperties)(version, doc);
    } else if ((spaces === null || spaces === void 0 ? void 0 : spaces.length) === 0) {
      // A SOC wrapper attempted to retrieve this object in a pre-flight request and it was not found.
      const error = errorContent(_errors.SavedObjectsErrorHelpers.createGenericNotFoundError(type, id));
      return {
        tag: 'Left',
        value: {
          id,
          type,
          spaces: [],
          error
        }
      };
    } else {
      versionProperties = (0, _internal_utils.getExpectedVersionProperties)(version);
    }

    const {
      updatedSpaces,
      removedSpaces,
      isUpdateRequired
    } = analyzeSpaceChanges(currentSpaces, spacesToAdd, spacesToRemove);
    const expectedResult = {
      type,
      id,
      updatedSpaces,
      ...(isUpdateRequired && {
        esRequestIndex: bulkOperationRequestIndexCounter++
      })
    };

    if (isUpdateRequired) {
      const documentMetadata = {
        _id: serializer.generateRawId(undefined, type, id),
        _index: getIndexForType(type),
        ...versionProperties
      };

      if (updatedSpaces.length) {
        const documentToSave = {
          updated_at: time,
          namespaces: updatedSpaces
        }; // @ts-expect-error BulkOperation.retry_on_conflict, BulkOperation.routing. BulkOperation.version, and BulkOperation.version_type are optional

        bulkOperationParams.push({
          update: documentMetadata
        }, {
          doc: documentToSave
        });
      } else {
        bulkOperationParams.push({
          delete: documentMetadata
        });
      }

      if (removedSpaces.length && !updatedSpaces.includes(_utils.ALL_NAMESPACES_STRING)) {
        // The object is being removed from at least one space; make sure to delete aliases appropriately
        objectsToDeleteAliasesFor.push({
          type,
          id,
          ...(removedSpaces.includes(_utils.ALL_NAMESPACES_STRING) ? {
            namespaces: updatedSpaces,
            deleteBehavior: 'exclusive'
          } : {
            namespaces: removedSpaces,
            deleteBehavior: 'inclusive'
          })
        });
      }
    }

    return {
      tag: 'Right',
      value: expectedResult
    };
  });
  const {
    refresh = _repository.DEFAULT_REFRESH_SETTING
  } = options;
  const bulkOperationResponse = bulkOperationParams.length ? await client.bulk({
    refresh,
    body: bulkOperationParams,
    require_alias: true
  }) : undefined; // Delete aliases if necessary, ensuring we don't have too many concurrent operations running.

  const mapper = async ({
    type,
    id,
    namespaces,
    deleteBehavior
  }) => (0, _legacy_url_aliases.deleteLegacyUrlAliases)({
    mappings,
    registry,
    client,
    getIndexForType,
    type,
    id,
    namespaces,
    deleteBehavior
  }).catch(err => {
    // The object has already been unshared, but we caught an error when attempting to delete aliases.
    // A consumer cannot attempt to unshare the object again, so just log the error and swallow it.
    logger.error(`Unable to delete aliases when unsharing an object: ${err.message}`);
  });

  await (0, _pMap.default)(objectsToDeleteAliasesFor, mapper, {
    concurrency: MAX_CONCURRENT_ALIAS_DELETIONS
  });
  return {
    objects: expectedBulkOperationResults.map(expectedResult => {
      if ((0, _internal_utils.isLeft)(expectedResult)) {
        return expectedResult.value;
      }

      const {
        type,
        id,
        updatedSpaces,
        esRequestIndex
      } = expectedResult.value;

      if (esRequestIndex !== undefined) {
        var _bulkOperationRespons;

        const response = (_bulkOperationRespons = bulkOperationResponse === null || bulkOperationResponse === void 0 ? void 0 : bulkOperationResponse.body.items[esRequestIndex]) !== null && _bulkOperationRespons !== void 0 ? _bulkOperationRespons : {};
        const rawResponse = Object.values(response)[0];
        const error = (0, _internal_utils.getBulkOperationError)(type, id, rawResponse);

        if (error) {
          return {
            id,
            type,
            spaces: [],
            error
          };
        }
      }

      return {
        id,
        type,
        spaces: updatedSpaces
      };
    })
  };
}
/** Extracts the contents of a decorated error to return the attributes for bulk operations. */


function errorContent(error) {
  return error.output.payload;
}
/** Gets the remaining spaces for an object after adding new ones and removing old ones. */


function analyzeSpaceChanges(existingSpaces, spacesToAdd, spacesToRemove) {
  const addSet = new Set(spacesToAdd);
  const removeSet = new Set(spacesToRemove);
  const removedSpaces = [];
  const updatedSpaces = existingSpaces.filter(x => {
    addSet.delete(x);
    const removed = removeSet.delete(x);

    if (removed) {
      removedSpaces.push(x);
    }

    return !removed;
  }).concat(Array.from(addSet));
  const isAnySpaceAdded = addSet.size > 0;
  const isAnySpaceRemoved = removeSet.size < spacesToRemove.length;
  const isUpdateRequired = isAnySpaceAdded || isAnySpaceRemoved;
  return {
    updatedSpaces,
    removedSpaces,
    isUpdateRequired
  };
}