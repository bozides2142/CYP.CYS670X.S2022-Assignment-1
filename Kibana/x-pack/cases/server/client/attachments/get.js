"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.find = find;
exports.get = get;
exports.getAll = getAll;
exports.getAllAlertsAttachToCase = void 0;

var _api = require("../../../common/api");

var _utils = require("../../common/utils");

var _error = require("../../common/error");

var _api2 = require("../../routes/api");

var _utils2 = require("../utils");

var _authorization = require("../../authorization");

var _utils3 = require("../../authorization/utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const normalizeAlertResponse = alerts => alerts.reduce((acc, alert) => {
  const {
    ids,
    indices
  } = (0, _utils.getIDsAndIndicesAsArrays)(alert.attributes);

  if (ids.length !== indices.length) {
    return acc;
  }

  return [...acc, ...ids.map((id, index) => ({
    id,
    index: indices[index],
    attached_at: alert.attributes.created_at
  }))];
}, []);
/**
 * Retrieves all alerts attached to a specific case.
 *
 * @ignore
 */


const getAllAlertsAttachToCase = async ({
  caseId
}, clientArgs, casesClient) => {
  const {
    unsecuredSavedObjectsClient,
    authorization,
    attachmentService,
    logger
  } = clientArgs;

  try {
    // This will perform an authorization check to ensure the user has access to the parent case
    const theCase = await casesClient.cases.get({
      id: caseId,
      includeComments: false
    });
    const {
      filter: authorizationFilter,
      ensureSavedObjectsAreAuthorized
    } = await authorization.getAuthorizationFilter(_authorization.Operations.getAlertsAttachedToCase);
    const alerts = await attachmentService.getAllAlertsAttachToCase({
      unsecuredSavedObjectsClient,
      caseId: theCase.id,
      filter: authorizationFilter
    });
    ensureSavedObjectsAreAuthorized(alerts.map(alert => ({
      owner: alert.attributes.owner,
      id: alert.id
    })));
    return normalizeAlertResponse(alerts);
  } catch (error) {
    throw (0, _error.createCaseError)({
      message: `Failed to get alerts attached to case id: ${caseId}: ${error}`,
      error,
      logger
    });
  }
};
/**
 * Retrieves the attachments for a case entity. This support pagination.
 *
 * @ignore
 */


exports.getAllAlertsAttachToCase = getAllAlertsAttachToCase;

async function find({
  caseID,
  queryParams
}, clientArgs) {
  const {
    unsecuredSavedObjectsClient,
    caseService,
    logger,
    authorization
  } = clientArgs;

  try {
    const {
      filter: authorizationFilter,
      ensureSavedObjectsAreAuthorized
    } = await authorization.getAuthorizationFilter(_authorization.Operations.findComments);
    const id = caseID;
    const {
      filter,
      ...queryWithoutFilter
    } = queryParams !== null && queryParams !== void 0 ? queryParams : {}; // if the fields property was defined, make sure we include the 'owner' field in the response

    const fields = (0, _utils3.includeFieldsRequiredForAuthentication)(queryWithoutFilter.fields); // combine any passed in filter property and the filter for the appropriate owner

    const combinedFilter = (0, _utils2.combineFilters)([(0, _utils2.stringToKueryNode)(filter), authorizationFilter]);
    const args = queryParams ? {
      caseService,
      unsecuredSavedObjectsClient,
      id,
      options: {
        // We need this because the default behavior of getAllCaseComments is to return all the comments
        // unless the page and/or perPage is specified. Since we're spreading the query after the request can
        // still override this behavior.
        page: _api2.defaultPage,
        perPage: _api2.defaultPerPage,
        sortField: 'created_at',
        filter: combinedFilter,
        ...queryWithoutFilter,
        fields
      }
    } : {
      caseService,
      unsecuredSavedObjectsClient,
      id,
      options: {
        page: _api2.defaultPage,
        perPage: _api2.defaultPerPage,
        sortField: 'created_at',
        filter: combinedFilter
      }
    };
    const theComments = await caseService.getAllCaseComments(args);
    ensureSavedObjectsAreAuthorized(theComments.saved_objects.map(comment => ({
      owner: comment.attributes.owner,
      id: comment.id
    })));
    return _api.CommentsResponseRt.encode((0, _utils.transformComments)(theComments));
  } catch (error) {
    throw (0, _error.createCaseError)({
      message: `Failed to find comments case id: ${caseID}: ${error}`,
      error,
      logger
    });
  }
}
/**
 * Retrieves a single attachment by its ID.
 *
 * @ignore
 */


async function get({
  attachmentID,
  caseID
}, clientArgs) {
  const {
    attachmentService,
    unsecuredSavedObjectsClient,
    logger,
    authorization
  } = clientArgs;

  try {
    const comment = await attachmentService.get({
      unsecuredSavedObjectsClient,
      attachmentId: attachmentID
    });
    await authorization.ensureAuthorized({
      entities: [{
        owner: comment.attributes.owner,
        id: comment.id
      }],
      operation: _authorization.Operations.getComment
    });
    return _api.CommentResponseRt.encode((0, _utils.flattenCommentSavedObject)(comment));
  } catch (error) {
    throw (0, _error.createCaseError)({
      message: `Failed to get comment case id: ${caseID} attachment id: ${attachmentID}: ${error}`,
      error,
      logger
    });
  }
}
/**
 * Retrieves all the attachments for a case.
 *
 * @ignore
 */


async function getAll({
  caseID
}, clientArgs) {
  const {
    unsecuredSavedObjectsClient,
    caseService,
    logger,
    authorization
  } = clientArgs;

  try {
    const {
      filter,
      ensureSavedObjectsAreAuthorized
    } = await authorization.getAuthorizationFilter(_authorization.Operations.getAllComments);
    const comments = await caseService.getAllCaseComments({
      unsecuredSavedObjectsClient,
      id: caseID,
      options: {
        filter,
        sortField: _utils.defaultSortField
      }
    });
    ensureSavedObjectsAreAuthorized(comments.saved_objects.map(comment => ({
      id: comment.id,
      owner: comment.attributes.owner
    })));
    return _api.AllCommentsResponseRt.encode((0, _utils.flattenCommentSavedObjects)(comments.saved_objects));
  } catch (error) {
    throw (0, _error.createCaseError)({
      message: `Failed to get all comments case id: ${caseID}: ${error}`,
      error,
      logger
    });
  }
}