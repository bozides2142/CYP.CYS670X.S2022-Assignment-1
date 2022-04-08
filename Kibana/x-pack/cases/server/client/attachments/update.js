"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.update = update;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _models = require("../../common/models");

var _error = require("../../common/error");

var _api = require("../../../common/api");

var _constants = require("../../../common/constants");

var _utils = require("../utils");

var _authorization = require("../../authorization");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function createCommentableCase({
  attachmentService,
  caseService,
  unsecuredSavedObjectsClient,
  caseID,
  logger,
  lensEmbeddableFactory
}) {
  const caseInfo = await caseService.getCase({
    unsecuredSavedObjectsClient,
    id: caseID
  });
  return new _models.CommentableCase({
    attachmentService,
    caseService,
    caseInfo,
    unsecuredSavedObjectsClient,
    logger,
    lensEmbeddableFactory
  });
}
/**
 * Update an attachment.
 *
 * @ignore
 */


async function update({
  caseID,
  updateRequest: queryParams
}, clientArgs) {
  const {
    attachmentService,
    caseService,
    unsecuredSavedObjectsClient,
    logger,
    lensEmbeddableFactory,
    user,
    userActionService,
    authorization
  } = clientArgs;

  try {
    const {
      id: queryCommentId,
      version: queryCommentVersion,
      ...queryRestAttributes
    } = queryParams;
    (0, _utils.decodeCommentRequest)(queryRestAttributes);
    const commentableCase = await createCommentableCase({
      attachmentService,
      caseService,
      unsecuredSavedObjectsClient,
      caseID,
      logger,
      lensEmbeddableFactory
    });
    const myComment = await attachmentService.get({
      unsecuredSavedObjectsClient,
      attachmentId: queryCommentId
    });

    if (myComment == null) {
      throw _boom.default.notFound(`This comment ${queryCommentId} does not exist anymore.`);
    }

    await authorization.ensureAuthorized({
      entities: [{
        owner: myComment.attributes.owner,
        id: myComment.id
      }],
      operation: _authorization.Operations.updateComment
    });

    if (myComment.attributes.type !== queryRestAttributes.type) {
      throw _boom.default.badRequest(`You cannot change the type of the comment.`);
    }

    if (myComment.attributes.owner !== queryRestAttributes.owner) {
      throw _boom.default.badRequest(`You cannot change the owner of the comment.`);
    }

    const caseRef = myComment.references.find(c => c.type === _constants.CASE_SAVED_OBJECT);

    if (caseRef == null || caseRef != null && caseRef.id !== commentableCase.id) {
      throw _boom.default.notFound(`This comment ${queryCommentId} does not exist in ${commentableCase.id}).`);
    }

    if (queryCommentVersion !== myComment.version) {
      throw _boom.default.conflict('This case has been updated. Please refresh before saving additional updates.');
    }

    const updatedDate = new Date().toISOString();
    const {
      comment: updatedComment,
      commentableCase: updatedCase
    } = await commentableCase.updateComment({
      updateRequest: queryParams,
      updatedAt: updatedDate,
      user
    });
    await userActionService.createUserAction({
      type: _api.ActionTypes.comment,
      action: _api.Actions.update,
      unsecuredSavedObjectsClient,
      caseId: caseID,
      attachmentId: updatedComment.id,
      payload: {
        attachment: queryRestAttributes
      },
      user,
      owner: myComment.attributes.owner
    });
    return await updatedCase.encode();
  } catch (error) {
    throw (0, _error.createCaseError)({
      message: `Failed to patch comment case id: ${caseID}: ${error}`,
      error,
      logger
    });
  }
}