"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getExceptionListSummary = void 0;

var _securitysolutionListUtils = require("@kbn/securitysolution-list-utils");

var _server = require("../../../../../../src/core/server");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getExceptionListSummary = async ({
  filter,
  id,
  listId,
  savedObjectsClient,
  namespaceType
}) => {
  const savedObjectType = (0, _securitysolutionListUtils.getSavedObjectType)({
    namespaceType
  });
  let finalListId = listId !== null && listId !== void 0 ? listId : ''; // If id and no listId, get the list by id to use the list_id for the find below

  if (listId === null && id != null) {
    try {
      const savedObject = await savedObjectsClient.get(savedObjectType, id);
      finalListId = savedObject.attributes.list_id;
    } catch (err) {
      if (_server.SavedObjectsErrorHelpers.isNotFoundError(err)) {
        return null;
      } else {
        throw err;
      }
    }
  } // only pick the items in the list and not the list definition


  const itemTypeFilter = `${savedObjectType}.attributes.type: "simple"`;
  const adjustedFilter = filter ? `(${filter}) AND ${itemTypeFilter}` : itemTypeFilter;
  const savedObject = await savedObjectsClient.find({
    aggs: {
      by_os: {
        terms: {
          field: `${savedObjectType}.attributes.os_types`
        }
      }
    },
    filter: adjustedFilter,
    perPage: 0,
    search: finalListId,
    searchFields: ['list_id'],
    sortField: 'tie_breaker_id',
    sortOrder: 'desc',
    type: savedObjectType
  });

  if (!savedObject.aggregations) {
    return null;
  }

  const summary = savedObject.aggregations.by_os.buckets.reduce((acc, item) => ({ ...acc,
    [item.key]: item.doc_count,
    total: savedObject.total
  }), {
    linux: 0,
    macos: 0,
    total: 0,
    windows: 0
  });
  return summary;
};

exports.getExceptionListSummary = getExceptionListSummary;