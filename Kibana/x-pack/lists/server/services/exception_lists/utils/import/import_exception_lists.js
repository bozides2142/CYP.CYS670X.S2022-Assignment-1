"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.importExceptionLists = void 0;

var _find_all_exception_list_types = require("./find_all_exception_list_types");

var _sort_exception_lists_to_create_update = require("./sort_exception_lists_to_create_update");

var _bulk_create_imported_lists = require("./bulk_create_imported_lists");

var _bulk_update_imported_lists = require("./bulk_update_imported_lists");

var _delete_list_items_to_overwrite = require("./delete_list_items_to_overwrite");

var _sort_import_by_namespace = require("./sort_import_by_namespace");

var _sort_import_responses = require("./sort_import_responses");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Helper with logic determining when to create or update on exception list import
 * @param exceptionListsClient - exceptions client
 * @param listsChunks - exception lists being imported
 * @param isOverwrite - if matching lis_id found, should list be overwritten
 * @returns {Object} returns counts of successful imports and any errors found
 */


const importExceptionLists = async ({
  isOverwrite,
  listsChunks,
  savedObjectsClient,
  user
}) => {
  let importExceptionListsResponse = [];

  for await (const listChunk of listsChunks) {
    // sort by namespaceType
    const [agnosticLists, nonAgnosticLists] = (0, _sort_import_by_namespace.sortListsImportsByNamespace)(listChunk); // Gather lists referenced by items
    // Dictionary of found lists

    const foundLists = await (0, _find_all_exception_list_types.getAllListTypes)(agnosticLists.map(list => ({
      listId: list.list_id,
      namespaceType: list.namespace_type
    })), nonAgnosticLists.map(list => ({
      listId: list.list_id,
      namespaceType: list.namespace_type
    })), savedObjectsClient); // Figure out what lists to bulk create/update

    const {
      errors,
      listItemsToDelete,
      listsToCreate,
      listsToUpdate
    } = (0, _sort_exception_lists_to_create_update.sortExceptionListsToUpdateOrCreate)({
      existingLists: foundLists,
      isOverwrite,
      lists: listChunk,
      user
    }); // lists to bulk create/update

    const bulkCreateResponse = await (0, _bulk_create_imported_lists.bulkCreateImportedLists)({
      listsToCreate,
      savedObjectsClient
    }); // lists that are to be updated where overwrite is true, need to have
    // existing items removed. By selecting to overwrite, user selects to
    // overwrite entire list + items

    await (0, _delete_list_items_to_overwrite.deleteListItemsToBeOverwritten)({
      listsOfItemsToDelete: listItemsToDelete,
      savedObjectsClient
    });
    const bulkUpdateResponse = await (0, _bulk_update_imported_lists.bulkUpdateImportedLists)({
      listsToUpdate,
      savedObjectsClient
    });
    importExceptionListsResponse = [...importExceptionListsResponse, ...bulkCreateResponse, ...bulkUpdateResponse, ...errors];
  }

  return (0, _sort_import_responses.sortImportResponses)(importExceptionListsResponse);
};

exports.importExceptionLists = importExceptionLists;