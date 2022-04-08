"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CorruptSavedObjectError = void 0;
exports.migrateRawDocs = migrateRawDocs;
exports.migrateRawDocsSafely = migrateRawDocsSafely;

var Either = _interopRequireWildcard(require("fp-ts/lib/Either"));

var _ = require(".");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/*
 * This file provides logic for migrating raw documents.
 */

/**
 * Error thrown when saved object migrations encounter a corrupt saved object.
 * Corrupt saved objects cannot be serialized because:
 *  - there's no `[type]` property which contains the type attributes
 *  - the type or namespace in the _id doesn't match the `type` or `namespace`
 *    properties
 */
class CorruptSavedObjectError extends Error {
  constructor(rawId) {
    super(`Unable to migrate the corrupt saved object document with _id: '${rawId}'.`); // Set the prototype explicitly, see:
    // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work

    this.rawId = rawId;
    Object.setPrototypeOf(this, CorruptSavedObjectError.prototype);
  }

}
/**
 * Applies the specified migration function to every saved object document in the list
 * of raw docs. Any raw docs that are not valid saved objects will simply be passed through.
 * @param {TransformFn} migrateDoc
 * @param {SavedObjectsRawDoc[]} rawDocs
 * @returns {SavedObjectsRawDoc[]}
 */


exports.CorruptSavedObjectError = CorruptSavedObjectError;

async function migrateRawDocs(serializer, migrateDoc, rawDocs) {
  const migrateDocWithoutBlocking = transformNonBlocking(migrateDoc);
  const processedDocs = [];

  for (const raw of rawDocs) {
    const options = {
      namespaceTreatment: 'lax'
    };

    if (serializer.isRawSavedObject(raw, options)) {
      const savedObject = convertToRawAddMigrationVersion(raw, options, serializer);
      processedDocs.push(...(await migrateMapToRawDoc(migrateDocWithoutBlocking, savedObject, serializer)));
    } else {
      throw new CorruptSavedObjectError(raw._id);
    }
  }

  return processedDocs;
}

/**
 * Applies the specified migration function to every saved object document provided
 * and converts the saved object to a raw document.
 * Captures the ids and errors from any documents that are not valid saved objects or
 * for which the transformation function failed.
 * @returns {TaskEither.TaskEither<DocumentsTransformFailed, DocumentsTransformSuccess>}
 */
function migrateRawDocsSafely({
  serializer,
  migrateDoc,
  rawDocs
}) {
  return async () => {
    const migrateDocNonBlocking = transformNonBlocking(migrateDoc);
    const processedDocs = [];
    const transformErrors = [];
    const corruptSavedObjectIds = [];
    const options = {
      namespaceTreatment: 'lax'
    };

    for (const raw of rawDocs) {
      if (serializer.isRawSavedObject(raw, options)) {
        try {
          const savedObject = convertToRawAddMigrationVersion(raw, options, serializer);
          processedDocs.push(...(await migrateMapToRawDoc(migrateDocNonBlocking, savedObject, serializer)));
        } catch (err) {
          if (err instanceof _.TransformSavedObjectDocumentError) {
            // the doc id we get from the error is only the uuid part
            // we use the original raw document _id instead
            transformErrors.push({
              rawId: raw._id,
              err
            });
          } else {
            transformErrors.push({
              rawId: raw._id,
              err
            }); // cases we haven't accounted for yet
          }
        }
      } else {
        corruptSavedObjectIds.push(raw._id);
      }
    }

    if (corruptSavedObjectIds.length > 0 || transformErrors.length > 0) {
      return Either.left({
        type: 'documents_transform_failed',
        corruptDocumentIds: [...corruptSavedObjectIds],
        transformErrors
      });
    }

    return Either.right({
      processedDocs
    });
  };
}
/**
 * Migration transform functions are potentially CPU heavy e.g. doing decryption/encryption
 * or (de)/serializing large JSON payloads.
 * Executing all transforms for a batch in a synchronous loop can block the event-loop for a long time.
 * To prevent this we use setImmediate to ensure that the event-loop can process other parallel
 * work in between each transform.
 */


function transformNonBlocking(transform) {
  // promises aren't enough to unblock the event loop
  return doc => new Promise((resolve, reject) => {
    // set immediate is though
    setImmediate(() => {
      try {
        resolve(transform(doc));
      } catch (e) {
        reject(e);
      }
    });
  });
}
/**
 * Applies the specified migration function to every saved object document provided
 * and converts the saved object to a raw document
 * @param {MigrateFn} transformNonBlocking
 * @param {SavedObjectsRawDoc[]} rawDoc
 * @returns {Promise<SavedObjectsRawDoc[]>}
 */


async function migrateMapToRawDoc(migrateMethod, savedObject, serializer) {
  return [...(await migrateMethod(savedObject))].map(attrs => serializer.savedObjectToRaw({
    references: [],
    ...attrs
  }));
}
/**
 * Sanitizes the raw saved object document
 * @param {SavedObjectRawDoc} rawDoc
 * @param options
 * @param {SavedObjectsSerializer} serializer
 * @returns {SavedObjectSanitizedDoc<unknown>}
 */


function convertToRawAddMigrationVersion(rawDoc, options, serializer) {
  const savedObject = serializer.rawToSavedObject(rawDoc, options);
  savedObject.migrationVersion = savedObject.migrationVersion || {};
  return savedObject;
}