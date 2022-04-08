"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteAll = deleteAll;
exports.deleteComment = deleteComment;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _pMap = _interopRequireDefault(require("p-map"));

var _api = require("../../../common/api");

var _constants = require("../../../common/constants");

var _error = require("../../common/error");

var _authorization = require("../../authorization");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Delete all comments for a case.
 *
 * @ignore
 */


async function deleteAll({
  caseID
}, clientArgs) {
  const {
    user,
    unsecuredSavedObjectsClient,
    caseService,
    attachmentService,
    userActionService,
    logger,
    authorization
  } = clientArgs;

  try {
    const comments = await caseService.getAllCaseComments({
      unsecuredSavedObjectsClient,
      id: caseID
    });

    if (comments.total <= 0) {
      throw _boom.default.notFound(`No comments found for ${caseID}.`);
    }

    await authorization.ensureAuthorized({
      operation: _authorization.Operations.deleteAllComments,
      entities: comments.saved_objects.map(comment => ({
        owner: comment.attributes.owner,
        id: comment.id
      }))
    });

    const mapper = async comment => attachmentService.delete({
      unsecuredSavedObjectsClient,
      attachmentId: comment.id
    }); // Ensuring we don't too many concurrent deletions running.


    await (0, _pMap.default)(comments.saved_objects, mapper, {
      concurrency: _constants.MAX_CONCURRENT_SEARCHES
    });
    await userActionService.bulkCreateAttachmentDeletion({
      unsecuredSavedObjectsClient,
      caseId: caseID,
      attachments: comments.saved_objects.map(comment => ({
        id: comment.id,
        owner: comment.attributes.owner,
        attachment: comment.attributes
      })),
      user
    });
  } catch (error) {
    throw (0, _error.createCaseError)({
      message: `Failed to delete all comments case id: ${caseID}: ${error}`,
      error,
      logger
    });
  }
}
/**
 * Deletes an attachment
 *
 * @ignore
 */


async function deleteComment({
  caseID,
  attachmentID
}, clientArgs) {
  const {
    user,
    unsecuredSavedObjectsClient,
    attachmentService,
    userActionService,
    logger,
    authorization
  } = clientArgs;

  try {
    const myComment = await attachmentService.get({
      unsecuredSavedObjectsClient,
      attachmentId: attachmentID
    });

    if (myComment == null) {
      throw _boom.default.notFound(`This comment ${attachmentID} does not exist anymore.`);
    }

    await authorization.ensureAuthorized({
      entities: [{
        owner: myComment.attributes.owner,
        id: myComment.id
      }],
      operation: _authorization.Operations.deleteComment
    });
    const type = _constants.CASE_SAVED_OBJECT;
    const id = caseID;
    const caseRef = myComment.references.find(c => c.type === type);

    if (caseRef == null || caseRef != null && caseRef.id !== id) {
      throw _boom.default.notFound(`This comment ${attachmentID} does not exist in ${id}.`);
    }

    await attachmentService.delete({
      unsecuredSavedObjectsClient,
      attachmentId: attachmentID
    });
    await userActionService.createUserAction({
      type: _api.ActionTypes.comment,
      action: _api.Actions.delete,
      unsecuredSavedObjectsClient,
      caseId: id,
      attachmentId: attachmentID,
      payload: {
        attachment: { ...myComment.attributes
        }
      },
      user,
      owner: myComment.attributes.owner
    });
  } catch (error) {
    throw (0, _error.createCaseError)({
      message: `Failed to delete comment: ${caseID} comment id: ${attachmentID}: ${error}`,
      error,
      logger
    });
  }
}