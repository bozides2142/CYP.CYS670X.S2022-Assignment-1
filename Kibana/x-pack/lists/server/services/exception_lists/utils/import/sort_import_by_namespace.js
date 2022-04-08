"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sortListsImportsByNamespace = exports.sortItemsImportsByNamespace = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Helper to sort exception lists by namespace type
 * @param exceptions {array} exception lists to sort
 * @returns {array} tuple of agnostic and non agnostic lists
 */

const sortListsImportsByNamespace = exceptions => {
  return exceptions.reduce(([agnostic, single], uniqueList) => {
    if (uniqueList.namespace_type === 'agnostic') {
      return [[...agnostic, uniqueList], single];
    } else {
      return [agnostic, [...single, uniqueList]];
    }
  }, [[], []]);
};
/**
 * Helper to sort exception list items by namespace type
 * @param exceptions {array} exception list items to sort
 * @returns {array} tuple of agnostic and non agnostic items
 */


exports.sortListsImportsByNamespace = sortListsImportsByNamespace;

const sortItemsImportsByNamespace = exceptions => {
  return exceptions.reduce(([agnostic, single], uniqueList) => {
    if (uniqueList.namespace_type === 'agnostic') {
      return [[...agnostic, uniqueList], single];
    } else {
      return [agnostic, [...single, uniqueList]];
    }
  }, [[], []]);
};

exports.sortItemsImportsByNamespace = sortItemsImportsByNamespace;