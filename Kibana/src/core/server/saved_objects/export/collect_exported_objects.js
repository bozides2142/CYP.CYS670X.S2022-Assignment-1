"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.collectExportedObjects = void 0;

var _apply_export_transforms = require("./apply_export_transforms");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const collectExportedObjects = async ({
  objects,
  includeReferences = true,
  namespace,
  request,
  typeRegistry,
  savedObjectsClient,
  logger
}) => {
  const exportTransforms = buildTransforms(typeRegistry);
  const isExportable = buildIsExportable(typeRegistry);
  const collectedObjects = [];
  const collectedMissingRefs = [];
  const collectedNonExportableObjects = [];
  const alreadyProcessed = new Set();
  let currentObjects = objects;

  do {
    currentObjects = currentObjects.filter(object => !alreadyProcessed.has(objKey(object))); // first, evict current objects that are not exportable

    const {
      exportable: untransformedExportableInitialObjects,
      nonExportable: nonExportableInitialObjects
    } = await splitByExportability(currentObjects, isExportable, logger);
    collectedNonExportableObjects.push(...nonExportableInitialObjects);
    nonExportableInitialObjects.forEach(obj => alreadyProcessed.add(objKey(obj))); // second, apply export transforms to exportable objects

    const transformedObjects = (await (0, _apply_export_transforms.applyExportTransforms)({
      request,
      objects: untransformedExportableInitialObjects,
      transforms: exportTransforms
    })).filter(object => !alreadyProcessed.has(objKey(object)));
    transformedObjects.forEach(obj => alreadyProcessed.add(objKey(obj))); // last, evict additional objects that are not exportable

    const {
      included: exportableInitialObjects,
      excluded: additionalObjects
    } = splitByKeys(transformedObjects, untransformedExportableInitialObjects.map(obj => objKey(obj)));
    const {
      exportable: exportableAdditionalObjects,
      nonExportable: nonExportableAdditionalObjects
    } = await splitByExportability(additionalObjects, isExportable, logger);
    const allExportableObjects = [...exportableInitialObjects, ...exportableAdditionalObjects];
    collectedNonExportableObjects.push(...nonExportableAdditionalObjects);
    collectedObjects.push(...allExportableObjects); // if `includeReferences` is true, recurse on exportable objects' references.

    if (includeReferences) {
      const references = collectReferences(allExportableObjects, alreadyProcessed);

      if (references.length) {
        const {
          objects: fetchedObjects,
          missingRefs
        } = await fetchReferences({
          references,
          namespace,
          client: savedObjectsClient
        });
        collectedMissingRefs.push(...missingRefs);
        currentObjects = fetchedObjects;
      } else {
        currentObjects = [];
      }
    } else {
      currentObjects = [];
    }
  } while (includeReferences && currentObjects.length);

  return {
    objects: collectedObjects,
    excludedObjects: collectedNonExportableObjects,
    missingRefs: collectedMissingRefs
  };
};

exports.collectExportedObjects = collectExportedObjects;

const objKey = obj => `${obj.type}:${obj.id}`;

const collectReferences = (objects, alreadyProcessed) => {
  const references = new Map();
  objects.forEach(obj => {
    var _obj$references;

    (_obj$references = obj.references) === null || _obj$references === void 0 ? void 0 : _obj$references.forEach(ref => {
      const refKey = objKey(ref);

      if (!alreadyProcessed.has(refKey)) {
        references.set(refKey, {
          type: ref.type,
          id: ref.id
        });
      }
    });
  });
  return [...references.values()];
};

const fetchReferences = async ({
  references,
  client,
  namespace
}) => {
  const {
    saved_objects: savedObjects
  } = await client.bulkGet(references, {
    namespace
  });
  return {
    objects: savedObjects.filter(obj => !obj.error),
    missingRefs: savedObjects.filter(obj => obj.error).map(obj => ({
      type: obj.type,
      id: obj.id
    }))
  };
};

const buildTransforms = typeRegistry => typeRegistry.getAllTypes().reduce((transformMap, type) => {
  var _type$management;

  if ((_type$management = type.management) !== null && _type$management !== void 0 && _type$management.onExport) {
    transformMap.set(type.name, type.management.onExport);
  }

  return transformMap;
}, new Map());

const buildIsExportable = typeRegistry => {
  const exportablePerType = typeRegistry.getAllTypes().reduce((exportableMap, type) => {
    var _type$management2;

    if ((_type$management2 = type.management) !== null && _type$management2 !== void 0 && _type$management2.isExportable) {
      exportableMap.set(type.name, type.management.isExportable);
    }

    return exportableMap;
  }, new Map());
  return obj => {
    const typePredicate = exportablePerType.get(obj.type);
    return typePredicate ? typePredicate(obj) : true;
  };
};

const splitByExportability = (objects, isExportable, logger) => {
  const exportableObjects = [];
  const nonExportableObjects = [];
  objects.forEach(obj => {
    try {
      const exportable = isExportable(obj);

      if (exportable) {
        exportableObjects.push(obj);
      } else {
        nonExportableObjects.push({
          id: obj.id,
          type: obj.type,
          reason: 'excluded'
        });
      }
    } catch (e) {
      var _e$stack;

      logger.error(`Error invoking "isExportable" for object ${obj.type}:${obj.id}. Error was: ${(_e$stack = e.stack) !== null && _e$stack !== void 0 ? _e$stack : e.message}`);
      nonExportableObjects.push({
        id: obj.id,
        type: obj.type,
        reason: 'predicate_error'
      });
    }
  });
  return {
    exportable: exportableObjects,
    nonExportable: nonExportableObjects
  };
};

const splitByKeys = (objects, keys) => {
  const included = [];
  const excluded = [];
  objects.forEach(obj => {
    if (keys.includes(objKey(obj))) {
      included.push(obj);
    } else {
      excluded.push(obj);
    }
  });
  return {
    included,
    excluded
  };
};