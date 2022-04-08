"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getItemsFilter = exports.getAllListItemTypes = exports.findAllListItemTypes = void 0;

var _securitysolutionListUtils = require("@kbn/securitysolution-list-utils");

var _find_exception_list_items = require("../../find_exception_list_items");

var _import_exception_list_and_items = require("../../import_exception_list_and_items");

var _ = require("..");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Helper to build out a filter using item_ids
 * @param objects {array} - exception list items to add to filter
 * @param savedObjectsClient {object}
 * @returns {string} filter
 */


const getItemsFilter = ({
  objects,
  namespaceType
}) => {
  return `${(0, _securitysolutionListUtils.getSavedObjectTypes)({
    namespaceType: [namespaceType]
  })[0]}.attributes.item_id:(${objects.map(item => item.item_id).join(' OR ')})`;
};
/**
 * Find exception items that may or may not match an existing item_id
 * @param agnosticListItems {array} - items with a namespace of agnostic
 * @param nonAgnosticListItems {array} - items with a namespace of single
 * @param savedObjectsClient {object}
 * @returns {object} results of any found items
 */


exports.getItemsFilter = getItemsFilter;

const findAllListItemTypes = async (agnosticListItems, nonAgnosticListItems, savedObjectsClient) => {
  // Agnostic filter
  const agnosticFilter = getItemsFilter({
    namespaceType: 'agnostic',
    objects: agnosticListItems
  }); // Non-agnostic filter

  const nonAgnosticFilter = getItemsFilter({
    namespaceType: 'single',
    objects: nonAgnosticListItems
  }); // savedObjectTypes

  const savedObjectType = (0, _securitysolutionListUtils.getSavedObjectTypes)({
    namespaceType: ['single']
  });
  const savedObjectTypeAgnostic = (0, _securitysolutionListUtils.getSavedObjectTypes)({
    namespaceType: ['agnostic']
  });

  if (!agnosticListItems.length && !nonAgnosticListItems.length) {
    return null;
  } else if (agnosticListItems.length && !nonAgnosticListItems.length) {
    return savedObjectsClient.find({
      filter: (0, _find_exception_list_items.getExceptionListsItemFilter)({
        filter: [agnosticFilter],
        listId: agnosticListItems.map(({
          list_id: listId
        }) => listId),
        savedObjectType: agnosticListItems.map(({
          namespace_type: namespaceType
        }) => (0, _securitysolutionListUtils.getSavedObjectTypes)({
          namespaceType: [namespaceType]
        })[0])
      }),
      page: undefined,
      perPage: _import_exception_list_and_items.CHUNK_PARSED_OBJECT_SIZE,
      sortField: undefined,
      sortOrder: undefined,
      type: savedObjectTypeAgnostic
    });
  } else if (!agnosticListItems.length && nonAgnosticListItems.length) {
    return savedObjectsClient.find({
      filter: (0, _find_exception_list_items.getExceptionListsItemFilter)({
        filter: [nonAgnosticFilter],
        listId: nonAgnosticListItems.map(({
          list_id: listId
        }) => listId),
        savedObjectType: nonAgnosticListItems.map(({
          namespace_type: namespaceType
        }) => (0, _securitysolutionListUtils.getSavedObjectTypes)({
          namespaceType: [namespaceType]
        })[0])
      }),
      page: undefined,
      perPage: _import_exception_list_and_items.CHUNK_PARSED_OBJECT_SIZE,
      sortField: undefined,
      sortOrder: undefined,
      type: savedObjectType
    });
  } else {
    const items = [...nonAgnosticListItems, ...agnosticListItems];
    return savedObjectsClient.find({
      filter: (0, _find_exception_list_items.getExceptionListsItemFilter)({
        filter: [nonAgnosticFilter, agnosticFilter],
        listId: items.map(({
          list_id: listId
        }) => listId),
        savedObjectType: items.map(({
          namespace_type: namespaceType
        }) => (0, _securitysolutionListUtils.getSavedObjectTypes)({
          namespaceType: [namespaceType]
        })[0])
      }),
      page: undefined,
      perPage: _import_exception_list_and_items.CHUNK_PARSED_OBJECT_SIZE,
      sortField: undefined,
      sortOrder: undefined,
      type: [...savedObjectType, ...savedObjectTypeAgnostic]
    });
  }
};
/**
 * Helper to find if any imported items match existing items based on item_id
 * @param agnosticListItems {array} - items with a namespace of agnostic
 * @param nonAgnosticListItems {array} - items with a namespace of single
 * @param savedObjectsClient {object}
 * @returns {object} results of any found items
 */


exports.findAllListItemTypes = findAllListItemTypes;

const getAllListItemTypes = async (agnosticListItems, nonAgnosticListItems, savedObjectsClient) => {
  // Gather items with matching item_id
  const foundItemsResponse = await findAllListItemTypes(agnosticListItems, nonAgnosticListItems, savedObjectsClient);

  if (foundItemsResponse == null) {
    return {};
  }

  const transformedResponse = (0, _.transformSavedObjectsToFoundExceptionListItem)({
    savedObjectsFindResponse: foundItemsResponse
  }); // Dictionary of found items

  return transformedResponse.data.reduce((acc, item) => ({ ...acc,
    [item.item_id]: item
  }), {});
};

exports.getAllListItemTypes = getAllListItemTypes;