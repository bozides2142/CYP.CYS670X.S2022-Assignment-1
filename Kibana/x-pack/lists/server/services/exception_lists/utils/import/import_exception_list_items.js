"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.importExceptionListItems = void 0;

var _find_all_exception_list_item_types = require("./find_all_exception_list_item_types");

var _find_all_exception_list_types = require("./find_all_exception_list_types");

var _sort_exception_items_to_create_update = require("./sort_exception_items_to_create_update");

var _bulk_create_imported_items = require("./bulk_create_imported_items");

var _bulk_update_imported_items = require("./bulk_update_imported_items");

var _sort_import_by_namespace = require("./sort_import_by_namespace");

var _sort_import_responses = require("./sort_import_responses");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Helper with logic determining when to create or update on exception list items import
 * @param savedObjectsClient
 * @param itemsChunks - exception list items being imported
 * @param isOverwrite - if matching item_id found, should item be overwritten
 * @param user - username
 * @returns {Object} returns counts of successful imports and any errors found
 */


const importExceptionListItems = async ({
  itemsChunks,
  isOverwrite,
  savedObjectsClient,
  user
}) => {
  let importExceptionListItemsResponse = [];

  for await (const itemsChunk of itemsChunks) {
    // sort by namespaceType
    const [agnosticListItems, nonAgnosticListItems] = (0, _sort_import_by_namespace.sortItemsImportsByNamespace)(itemsChunk);

    const mapList = list => ({
      listId: list.list_id,
      namespaceType: list.namespace_type
    }); // Gather lists referenced by items
    // Dictionary of found lists


    const foundLists = await (0, _find_all_exception_list_types.getAllListTypes)(agnosticListItems.map(mapList), nonAgnosticListItems.map(mapList), savedObjectsClient); // Find any existing items with matching item_id
    // Dictionary of found items

    const foundItems = await (0, _find_all_exception_list_item_types.getAllListItemTypes)(agnosticListItems, nonAgnosticListItems, savedObjectsClient); // Figure out which items need to be bulk created/updated

    const {
      errors,
      itemsToCreate,
      itemsToUpdate
    } = (0, _sort_exception_items_to_create_update.sortExceptionItemsToUpdateOrCreate)({
      existingItems: foundItems,
      existingLists: foundLists,
      isOverwrite,
      items: itemsChunk,
      user
    }); // Items to bulk create

    const bulkCreateResponse = await (0, _bulk_create_imported_items.bulkCreateImportedItems)({
      itemsToCreate,
      savedObjectsClient
    }); // Items to bulk update

    const bulkUpdateResponse = await (0, _bulk_update_imported_items.bulkUpdateImportedItems)({
      itemsToUpdate,
      savedObjectsClient
    });
    importExceptionListItemsResponse = [...importExceptionListItemsResponse, ...bulkCreateResponse, ...bulkUpdateResponse, ...errors];
  }

  return (0, _sort_import_responses.sortImportResponses)(importExceptionListItemsResponse);
};

exports.importExceptionListItems = importExceptionListItems;