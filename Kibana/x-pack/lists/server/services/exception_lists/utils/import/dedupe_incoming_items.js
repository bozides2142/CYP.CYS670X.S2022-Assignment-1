"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTupleErrorsAndUniqueExceptionListItems = void 0;

var _uuid = _interopRequireDefault(require("uuid"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Reports on duplicates and returns unique array of items
 * @param items - exception items to be checked for duplicate list_ids
 * @returns {Array} tuple of errors and unique items
 */


const getTupleErrorsAndUniqueExceptionListItems = items => {
  const {
    errors,
    itemsAcc
  } = items.reduce((acc, parsedExceptionItem) => {
    if (parsedExceptionItem instanceof Error) {
      acc.errors.set(_uuid.default.v4(), {
        error: {
          message: `Error found importing exception list item: ${parsedExceptionItem.message}`,
          status_code: 400
        },
        list_id: '(unknown item_id)'
      });
    } else {
      const {
        item_id: itemId,
        list_id: listId
      } = parsedExceptionItem;

      if (acc.itemsAcc.has(`${itemId}${listId}`)) {
        acc.errors.set(_uuid.default.v4(), {
          error: {
            message: `More than one exception list item with item_id: "${itemId}" found in imports. The last item will be used.`,
            status_code: 400
          },
          item_id: itemId
        });
      }

      acc.itemsAcc.set(`${itemId}${listId}`, parsedExceptionItem);
    }

    return acc;
  }, // using map (preserves ordering)
  {
    errors: new Map(),
    itemsAcc: new Map()
  });
  return [Array.from(errors.values()), Array.from(itemsAcc.values())];
};

exports.getTupleErrorsAndUniqueExceptionListItems = getTupleErrorsAndUniqueExceptionListItems;