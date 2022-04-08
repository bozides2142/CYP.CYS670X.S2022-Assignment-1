"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getListFilter = exports.getAllListTypes = exports.findAllListTypes = void 0;

var _securitysolutionListUtils = require("@kbn/securitysolution-list-utils");

var _find_exception_list = require("../../find_exception_list");

var _import_exception_list_and_items = require("../../import_exception_list_and_items");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Helper to build out a filter using list_id
 * @param objects {array} - exception lists to add to filter
 * @param savedObjectsClient {object}
 * @returns {string} filter
 */


const getListFilter = ({
  objects,
  namespaceType
}) => {
  return `${(0, _securitysolutionListUtils.getSavedObjectTypes)({
    namespaceType: [namespaceType]
  })[0]}.attributes.list_id:(${objects.map(list => list.listId).join(' OR ')})`;
};
/**
 * Find exception lists that may or may not match an existing list_id
 * @param agnosticListItems {array} - lists with a namespace of agnostic
 * @param nonAgnosticListItems {array} - lists with a namespace of single
 * @param savedObjectsClient {object}
 * @returns {object} results of any found lists
 */


exports.getListFilter = getListFilter;

const findAllListTypes = async (agnosticListItems, nonAgnosticListItems, savedObjectsClient) => {
  // Agnostic filter
  const agnosticFilter = getListFilter({
    namespaceType: 'agnostic',
    objects: agnosticListItems
  }); // Non-agnostic filter

  const nonAgnosticFilter = getListFilter({
    namespaceType: 'single',
    objects: nonAgnosticListItems
  });

  if (!agnosticListItems.length && !nonAgnosticListItems.length) {
    return null;
  } else if (agnosticListItems.length && !nonAgnosticListItems.length) {
    return (0, _find_exception_list.findExceptionList)({
      filter: agnosticFilter,
      namespaceType: ['agnostic'],
      page: undefined,
      perPage: _import_exception_list_and_items.CHUNK_PARSED_OBJECT_SIZE,
      savedObjectsClient,
      sortField: undefined,
      sortOrder: undefined
    });
  } else if (!agnosticListItems.length && nonAgnosticListItems.length) {
    return (0, _find_exception_list.findExceptionList)({
      filter: nonAgnosticFilter,
      namespaceType: ['single'],
      page: undefined,
      perPage: _import_exception_list_and_items.CHUNK_PARSED_OBJECT_SIZE,
      savedObjectsClient,
      sortField: undefined,
      sortOrder: undefined
    });
  } else {
    return (0, _find_exception_list.findExceptionList)({
      filter: `${agnosticFilter} OR ${nonAgnosticFilter}`,
      namespaceType: ['single', 'agnostic'],
      page: undefined,
      perPage: _import_exception_list_and_items.CHUNK_PARSED_OBJECT_SIZE,
      savedObjectsClient,
      sortField: undefined,
      sortOrder: undefined
    });
  }
};
/**
 * Helper to find if any imported lists match existing lists based on list_id
 * @param agnosticListItems {array} - lists with a namespace of agnostic
 * @param nonAgnosticListItems {array} - lists with a namespace of single
 * @param savedObjectsClient {object}
 * @returns {object} results of any found lists
 */


exports.findAllListTypes = findAllListTypes;

const getAllListTypes = async (agnosticListItems, nonAgnosticListItems, savedObjectsClient) => {
  // Gather lists referenced
  const foundListsResponse = await findAllListTypes(agnosticListItems, nonAgnosticListItems, savedObjectsClient);

  if (foundListsResponse == null) {
    return {};
  } // Dictionary of found lists


  return foundListsResponse.data.reduce((acc, list) => ({ ...acc,
    [list.list_id]: list
  }), {});
};

exports.getAllListTypes = getAllListTypes;