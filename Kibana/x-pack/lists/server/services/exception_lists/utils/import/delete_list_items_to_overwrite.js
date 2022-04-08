"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteListItemsToBeOverwritten = void 0;

var _delete_exception_list_items_by_list = require("../../delete_exception_list_items_by_list");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Helper to delete list items of exception lists to be updated
 * as a result of user selecting to overwrite
 * @param listsOfItemsToDelete {array} - information needed to delete exception list items
 * @param savedObjectsClient {object}
 * @returns {array} returns array of success and error formatted responses
 */


const deleteListItemsToBeOverwritten = async ({
  listsOfItemsToDelete,
  savedObjectsClient
}) => {
  for await (const list of listsOfItemsToDelete) {
    await (0, _delete_exception_list_items_by_list.deleteExceptionListItemByList)({
      listId: list[0],
      namespaceType: list[1],
      savedObjectsClient
    });
  }
};

exports.deleteListItemsToBeOverwritten = deleteListItemsToBeOverwritten;