"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.collectSavedObjects = collectSavedObjects;

var _utils = require("@kbn/utils");

var _errors = require("../errors");

var _get_non_unique_entries = require("./get_non_unique_entries");

var _create_limit_stream = require("./create_limit_stream");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
async function collectSavedObjects({
  readStream,
  objectLimit,
  filter,
  supportedTypes
}) {
  const errors = [];
  const entries = [];
  const importStateMap = new Map();
  const collectedObjects = await (0, _utils.createPromiseFromStreams)([readStream, (0, _create_limit_stream.createLimitStream)(objectLimit), (0, _utils.createFilterStream)(obj => {
    entries.push({
      type: obj.type,
      id: obj.id
    });

    if (supportedTypes.includes(obj.type)) {
      return true;
    }

    const {
      title
    } = obj.attributes;
    errors.push({
      id: obj.id,
      type: obj.type,
      title,
      meta: {
        title
      },
      error: {
        type: 'unsupported_type'
      }
    });
    return false;
  }), (0, _utils.createFilterStream)(obj => filter ? filter(obj) : true), (0, _utils.createMapStream)(obj => {
    importStateMap.set(`${obj.type}:${obj.id}`, {});

    for (const ref of (_obj$references = obj.references) !== null && _obj$references !== void 0 ? _obj$references : []) {
      var _obj$references;

      const key = `${ref.type}:${ref.id}`;

      if (!importStateMap.has(key)) {
        importStateMap.set(key, {
          isOnlyReference: true
        });
      }
    } // Ensure migrations execute on every saved object


    return Object.assign({
      migrationVersion: {}
    }, obj);
  }), (0, _utils.createConcatStream)([])]); // throw a BadRequest error if we see the same import object type/id more than once

  const nonUniqueEntries = (0, _get_non_unique_entries.getNonUniqueEntries)(entries);

  if (nonUniqueEntries.length > 0) {
    throw _errors.SavedObjectsImportError.nonUniqueImportObjects(nonUniqueEntries);
  }

  return {
    errors,
    collectedObjects,
    importStateMap
  };
}