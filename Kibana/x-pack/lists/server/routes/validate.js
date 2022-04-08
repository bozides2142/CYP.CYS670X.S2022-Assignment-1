"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateExceptionListSize = exports.validateEndpointExceptionItemEntries = void 0;

var _pipeable = require("fp-ts/lib/pipeable");

var _Either = require("fp-ts/lib/Either");

var _securitysolutionIoTsUtils = require("@kbn/securitysolution-io-ts-utils");

var _securitysolutionIoTsListTypes = require("@kbn/securitysolution-io-ts-list-types");

var _securitysolutionListConstants = require("@kbn/securitysolution-list-constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const validateExceptionListSize = async (exceptionLists, listId, namespaceType) => {
  const exceptionListItems = await exceptionLists.findExceptionListItem({
    filter: undefined,
    listId,
    namespaceType,
    page: undefined,
    perPage: undefined,
    sortField: undefined,
    sortOrder: undefined
  });

  if (exceptionListItems == null) {
    // If exceptionListItems is null then we couldn't find the list so it may have been deleted
    return {
      body: `Unable to find list id: ${listId} to verify max exception list size`,
      statusCode: 500
    };
  }

  const [validatedItems, err] = (0, _securitysolutionIoTsUtils.validate)(exceptionListItems, _securitysolutionIoTsListTypes.foundExceptionListItemSchema);

  if (err != null) {
    return {
      body: err,
      statusCode: 500
    };
  } // Unnecessary since validatedItems comes from exceptionListItems which is already
  // checked for null, but typescript fails to detect that


  if (validatedItems == null) {
    return {
      body: `Unable to find list id: ${listId} to verify max exception list size`,
      statusCode: 500
    };
  }

  if (validatedItems.total > _securitysolutionListConstants.MAX_EXCEPTION_LIST_SIZE) {
    return {
      body: `Failed to add exception item, exception list would exceed max size of ${_securitysolutionListConstants.MAX_EXCEPTION_LIST_SIZE}`,
      statusCode: 400
    };
  }

  return null;
};

exports.validateExceptionListSize = validateExceptionListSize;

const validateEndpointExceptionItemEntries = entries => (0, _pipeable.pipe)(_securitysolutionIoTsListTypes.nonEmptyEndpointEntriesArray.decode(entries), decoded => (0, _securitysolutionIoTsUtils.exactCheck)(entries, decoded), (0, _Either.fold)(errors => {
  return {
    body: (0, _securitysolutionIoTsUtils.formatErrors)(errors),
    statusCode: 400
  };
}, () => null));

exports.validateEndpointExceptionItemEntries = validateEndpointExceptionItemEntries;