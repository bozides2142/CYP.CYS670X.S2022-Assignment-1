"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get = void 0;

var _api = require("../../../common/api");

var _error = require("../../common/error");

var _authorization = require("../../authorization");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const get = async ({
  caseId
}, clientArgs) => {
  const {
    unsecuredSavedObjectsClient,
    userActionService,
    logger,
    authorization
  } = clientArgs;

  try {
    const userActions = await userActionService.getAll({
      unsecuredSavedObjectsClient,
      caseId
    });
    await authorization.ensureAuthorized({
      entities: userActions.saved_objects.map(userAction => ({
        owner: userAction.attributes.owner,
        id: userAction.id
      })),
      operation: _authorization.Operations.getUserActions
    });
    const resultsToEncode = extractAttributes(userActions);
    return _api.CaseUserActionsResponseRt.encode(resultsToEncode);
  } catch (error) {
    throw (0, _error.createCaseError)({
      message: `Failed to retrieve user actions case id: ${caseId}: ${error}`,
      error,
      logger
    });
  }
};

exports.get = get;

function extractAttributes(userActions) {
  return userActions.saved_objects.map(so => so.attributes);
}