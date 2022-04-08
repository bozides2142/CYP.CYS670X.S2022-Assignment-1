"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addComment = void 0;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _pipeable = require("fp-ts/lib/pipeable");

var _Either = require("fp-ts/lib/Either");

var _function = require("fp-ts/lib/function");

var _server = require("../../../../../../src/core/server");

var _api = require("../../../common/api");

var _models = require("../../common/models");

var _error = require("../../common/error");

var _utils = require("../../common/utils");

var _utils2 = require("../utils");

var _authorization = require("../../authorization");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function createCommentableCase({
  caseService,
  attachmentService,
  unsecuredSavedObjectsClient,
  id,
  logger,
  lensEmbeddableFactory
}) {
  const caseInfo = await caseService.getCase({
    unsecuredSavedObjectsClient,
    id
  });
  return new _models.CommentableCase({
    logger,
    caseInfo,
    caseService,
    attachmentService,
    unsecuredSavedObjectsClient,
    lensEmbeddableFactory
  });
}
/**
 * The arguments needed for creating a new attachment to a case.
 */

/**
 * Create an attachment to a case.
 *
 * @ignore
 */


const addComment = async (addArgs, clientArgs, casesClientInternal) => {
  const {
    comment,
    caseId
  } = addArgs;
  const query = (0, _pipeable.pipe)(_api.CommentRequestRt.decode(comment), (0, _Either.fold)((0, _api.throwErrors)(_boom.default.badRequest), _function.identity));
  const {
    unsecuredSavedObjectsClient,
    caseService,
    userActionService,
    attachmentService,
    user,
    logger,
    lensEmbeddableFactory,
    authorization,
    alertsService
  } = clientArgs;
  (0, _utils2.decodeCommentRequest)(comment);

  try {
    const savedObjectID = _server.SavedObjectsUtils.generateId();

    await authorization.ensureAuthorized({
      operation: _authorization.Operations.createComment,
      entities: [{
        owner: comment.owner,
        id: savedObjectID
      }]
    });
    const createdDate = new Date().toISOString();
    const combinedCase = await createCommentableCase({
      caseService,
      attachmentService,
      unsecuredSavedObjectsClient,
      id: caseId,
      logger,
      lensEmbeddableFactory
    }); // eslint-disable-next-line @typescript-eslint/naming-convention

    const {
      username,
      full_name,
      email
    } = user;
    const userInfo = {
      username,
      full_name,
      email
    };
    const {
      comment: newComment,
      commentableCase: updatedCase
    } = await combinedCase.createComment({
      createdDate,
      user: userInfo,
      commentReq: query,
      id: savedObjectID
    });

    if (newComment.attributes.type === _api.CommentType.alert && updatedCase.settings.syncAlerts) {
      const alertsToUpdate = (0, _utils.createAlertUpdateRequest)({
        comment: query,
        status: updatedCase.status
      });
      await alertsService.updateAlertsStatus(alertsToUpdate);
    }

    await userActionService.createUserAction({
      type: _api.ActionTypes.comment,
      action: _api.Actions.create,
      unsecuredSavedObjectsClient,
      caseId,
      attachmentId: newComment.id,
      payload: {
        attachment: query
      },
      user,
      owner: newComment.attributes.owner
    });
    return updatedCase.encode();
  } catch (error) {
    throw (0, _error.createCaseError)({
      message: `Failed while adding a comment to case id: ${caseId} error: ${error}`,
      error,
      logger
    });
  }
};

exports.addComment = addComment;