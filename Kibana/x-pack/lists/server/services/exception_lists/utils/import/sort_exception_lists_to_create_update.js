"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sortExceptionListsToUpdateOrCreate = void 0;

var _uuid = _interopRequireDefault(require("uuid"));

var _securitysolutionListUtils = require("@kbn/securitysolution-list-utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const sortExceptionListsToUpdateOrCreate = ({
  lists,
  existingLists,
  isOverwrite,
  user
}) => {
  const results = {
    errors: [],
    listItemsToDelete: [],
    listsToCreate: [],
    listsToUpdate: []
  };

  for (const chunk of lists) {
    const {
      description,
      meta,
      list_id: listId,
      name,
      namespace_type: namespaceType,
      tags,
      type,
      version
    } = chunk;
    const dateNow = new Date().toISOString();
    const savedObjectType = (0, _securitysolutionListUtils.getSavedObjectType)({
      namespaceType
    });

    if (existingLists[listId] == null) {
      results.listsToCreate = [...results.listsToCreate, {
        attributes: {
          comments: undefined,
          created_at: dateNow,
          created_by: user,
          description,
          entries: undefined,
          immutable: false,
          item_id: undefined,
          list_id: listId,
          list_type: 'list',
          meta,
          name,
          os_types: [],
          tags,
          tie_breaker_id: _uuid.default.v4(),
          type,
          updated_by: user,
          version
        },
        type: savedObjectType
      }];
    } else if (existingLists[listId] != null && isOverwrite) {
      results.listItemsToDelete = [...results.listItemsToDelete, [listId, namespaceType]];
      results.listsToUpdate = [...results.listsToUpdate, {
        attributes: {
          description,
          meta,
          name,
          tags,
          type,
          updated_by: user
        },
        id: existingLists[listId].id,
        type: savedObjectType
      }];
    } else if (existingLists[listId] != null) {
      results.errors = [...results.errors, {
        error: {
          message: `Found that list_id: "${listId}" already exists. Import of list_id: "${listId}" skipped.`,
          status_code: 409
        },
        list_id: listId
      }];
    }
  }

  return results;
};

exports.sortExceptionListsToUpdateOrCreate = sortExceptionListsToUpdateOrCreate;