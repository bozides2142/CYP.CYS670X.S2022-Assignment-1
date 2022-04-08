"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleExport = handleExport;

var _constants = require("../../../common/constants");

var _utils = require("../../common/utils");

var _error = require("../../common/error");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function handleExport({
  context,
  objects,
  coreSetup,
  logger
}) {
  try {
    if (objects.length <= 0) {
      return [];
    }

    const [{
      savedObjects
    }] = await coreSetup.getStartServices();
    const savedObjectsClient = savedObjects.getScopedClient(context.request, {
      includedHiddenTypes: _constants.SAVED_OBJECT_TYPES
    });
    const caseIds = objects.map(caseObject => caseObject.id);
    const attachmentsAndUserActionsForCases = await getAttachmentsAndUserActionsForCases(savedObjectsClient, caseIds);
    return [...objects, ...attachmentsAndUserActionsForCases.flat()];
  } catch (error) {
    throw (0, _error.createCaseError)({
      message: `Failed to retrieve associated objects for exporting of cases: ${error}`,
      error,
      logger
    });
  }
}

async function getAttachmentsAndUserActionsForCases(savedObjectsClient, caseIds) {
  const [attachments, userActions] = await Promise.all([getAssociatedObjects({
    savedObjectsClient,
    caseIds,
    sortField: _utils.defaultSortField,
    type: _constants.CASE_COMMENT_SAVED_OBJECT
  }), getAssociatedObjects({
    savedObjectsClient,
    caseIds,
    sortField: _utils.defaultSortField,
    type: _constants.CASE_USER_ACTION_SAVED_OBJECT
  })]);
  return [...attachments, ...userActions];
}

async function getAssociatedObjects({
  savedObjectsClient,
  caseIds,
  sortField,
  type
}) {
  const references = caseIds.map(id => ({
    type: _constants.CASE_SAVED_OBJECT,
    id
  }));
  const finder = savedObjectsClient.createPointInTimeFinder({
    type,
    hasReferenceOperator: 'OR',
    hasReference: references,
    perPage: _constants.MAX_DOCS_PER_PAGE,
    sortField,
    sortOrder: 'asc'
  });
  let result = [];

  for await (const findResults of finder.find()) {
    result = result.concat(findResults.saved_objects);
  }

  return result;
}