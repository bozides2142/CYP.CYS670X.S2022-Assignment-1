"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bulkCreateImportedItems = void 0;

var _fp = require("lodash/fp");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Helper to bulk create exception list items
 * container
 * @param itemsToCreate {array} - exception items to be bulk created
 * @param savedObjectsClient {object}
 * @returns {array} returns array of success and error formatted responses
 */


const bulkCreateImportedItems = async ({
  itemsToCreate,
  savedObjectsClient
}) => {
  if (!itemsToCreate.length) {
    return [];
  }

  const bulkCreateResponse = await savedObjectsClient.bulkCreate(itemsToCreate, {
    overwrite: false
  });
  return bulkCreateResponse.saved_objects.map(so => {
    if ((0, _fp.has)('error', so) && so.error != null) {
      var _so$error$statusCode;

      return {
        error: {
          message: so.error.message,
          status_code: (_so$error$statusCode = so.error.statusCode) !== null && _so$error$statusCode !== void 0 ? _so$error$statusCode : 400
        },
        item_id: '(unknown item_id)'
      };
    } else {
      return {
        id: so.id,
        status_code: 200
      };
    }
  });
};

exports.bulkCreateImportedItems = bulkCreateImportedItems;