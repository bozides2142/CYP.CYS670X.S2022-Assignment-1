"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkReferenceOrigins = checkReferenceOrigins;

var _pMap = _interopRequireDefault(require("p-map"));

var _internal_utils = require("../../service/lib/internal_utils");

var _utils = require("./utils");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const MAX_CONCURRENT_SEARCHES = 10;
/**
 * Searches for any existing object(s) for the given reference; if there is exactly one object with a matching origin *and* its ID is
 * different than this reference ID, then this returns the different ID. Otherwise, it returns null.
 */

async function checkOrigin(type, id, savedObjectsClient, namespace) {
  const findOptions = {
    type,
    search: (0, _utils.createOriginQuery)(type, id),
    rootSearchFields: ['_id', 'originId'],
    page: 1,
    perPage: 1,
    // we only need one result for now
    fields: ['title'],
    // we don't actually need the object's title, we just specify one field so we don't fetch *all* fields
    sortField: 'updated_at',
    sortOrder: 'desc',
    ...(namespace && {
      namespaces: [namespace]
    })
  };
  const findResult = await savedObjectsClient.find(findOptions);
  const {
    total,
    saved_objects: savedObjects
  } = findResult;

  if (total === 1) {
    const [object] = savedObjects;

    if (id !== object.id) {
      return {
        key: (0, _internal_utils.getObjectKey)({
          type,
          id
        }),
        value: {
          isOnlyReference: true,
          destinationId: object.id
        }
      };
    }
  } // TODO: if the total is 2+, return an "ambiguous reference origin match" to the consumer (#120313)


  return null;
}

async function checkReferenceOrigins(params) {
  const {
    savedObjectsClient,
    namespace
  } = params;
  const referencesToCheck = [];

  for (const [key, {
    isOnlyReference
  }] of params.importStateMap.entries()) {
    const {
      type,
      id
    } = (0, _internal_utils.parseObjectKey)(key);

    if (params.typeRegistry.isMultiNamespace(type) && isOnlyReference) {
      referencesToCheck.push({
        type,
        id
      });
    }
  } // Check each object for possible destination conflicts, ensuring we don't too many concurrent searches running.


  const mapper = async ({
    type,
    id
  }) => checkOrigin(type, id, savedObjectsClient, namespace);

  const checkOriginResults = await (0, _pMap.default)(referencesToCheck, mapper, {
    concurrency: MAX_CONCURRENT_SEARCHES
  });
  const importStateMap = new Map();

  for (const result of checkOriginResults) {
    if (result) {
      const {
        key,
        value
      } = result;
      importStateMap.set(key, value);
    }
  }

  return {
    importStateMap
  };
}