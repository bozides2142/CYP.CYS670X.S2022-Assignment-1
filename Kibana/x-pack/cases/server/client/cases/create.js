"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.create = void 0;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _pipeable = require("fp-ts/lib/pipeable");

var _Either = require("fp-ts/lib/Either");

var _function = require("fp-ts/lib/function");

var _server = require("../../../../../../src/core/server");

var _api = require("../../../common/api");

var _constants = require("../../../common/constants");

var _validators = require("../../../common/utils/validators");

var _authorization = require("../../authorization");

var _error = require("../../common/error");

var _utils = require("../../common/utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Creates a new case.
 *
 * @ignore
 */


const create = async (data, clientArgs) => {
  const {
    unsecuredSavedObjectsClient,
    caseService,
    userActionService,
    user,
    logger,
    authorization: auth
  } = clientArgs;
  const query = (0, _pipeable.pipe)((0, _api.excess)(_api.CasePostRequestRt).decode({ ...data
  }), (0, _Either.fold)((0, _api.throwErrors)(_boom.default.badRequest), _function.identity));

  if (query.title.length > _constants.MAX_TITLE_LENGTH) {
    throw _boom.default.badRequest(`The length of the title is too long. The maximum length is ${_constants.MAX_TITLE_LENGTH}.`);
  }

  if (query.tags.some(_validators.isInvalidTag)) {
    throw _boom.default.badRequest('A tag must contain at least one non-space character');
  }

  try {
    const savedObjectID = _server.SavedObjectsUtils.generateId();

    await auth.ensureAuthorized({
      operation: _authorization.Operations.createCase,
      entities: [{
        owner: query.owner,
        id: savedObjectID
      }]
    });
    const newCase = await caseService.postNewCase({
      unsecuredSavedObjectsClient,
      attributes: (0, _utils.transformNewCase)({
        user,
        newCase: query
      }),
      id: savedObjectID
    });
    await userActionService.createUserAction({
      type: _api.ActionTypes.create_case,
      unsecuredSavedObjectsClient,
      caseId: newCase.id,
      user,
      payload: query,
      owner: newCase.attributes.owner
    });
    return _api.CaseResponseRt.encode((0, _utils.flattenCaseSavedObject)({
      savedObject: newCase
    }));
  } catch (error) {
    throw (0, _error.createCaseError)({
      message: `Failed to create case: ${error}`,
      error,
      logger
    });
  }
};

exports.create = create;