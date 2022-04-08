"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createStatsSubClient = createStatsSubClient;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _pipeable = require("fp-ts/lib/pipeable");

var _Either = require("fp-ts/lib/Either");

var _function = require("fp-ts/lib/function");

var _api = require("../../../common/api");

var _authorization = require("../../authorization");

var _error = require("../../common/error");

var _utils = require("../utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Creates the interface for retrieving the number of open, closed, and in progress cases.
 *
 * @ignore
 */


function createStatsSubClient(clientArgs) {
  return Object.freeze({
    getStatusTotalsByType: params => getStatusTotalsByType(params, clientArgs)
  });
}

async function getStatusTotalsByType(params, clientArgs) {
  const {
    unsecuredSavedObjectsClient,
    caseService,
    logger,
    authorization
  } = clientArgs;

  try {
    const queryParams = (0, _pipeable.pipe)((0, _api.excess)(_api.CasesStatusRequestRt).decode(params), (0, _Either.fold)((0, _api.throwErrors)(_boom.default.badRequest), _function.identity));
    const {
      filter: authorizationFilter,
      ensureSavedObjectsAreAuthorized
    } = await authorization.getAuthorizationFilter(_authorization.Operations.getCaseStatuses); // casesStatuses are bounded by us. No need to limit concurrent calls.

    const [openCases, inProgressCases, closedCases] = await Promise.all([..._api.caseStatuses.map(status => {
      const statusQuery = (0, _utils.constructQueryOptions)({
        owner: queryParams.owner,
        status,
        authorizationFilter
      });
      return caseService.findCaseStatusStats({
        unsecuredSavedObjectsClient,
        caseOptions: statusQuery,
        ensureSavedObjectsAreAuthorized
      });
    })]);
    return _api.CasesStatusResponseRt.encode({
      count_open_cases: openCases,
      count_in_progress_cases: inProgressCases,
      count_closed_cases: closedCases
    });
  } catch (error) {
    throw (0, _error.createCaseError)({
      message: `Failed to get status stats: ${error}`,
      error,
      logger
    });
  }
}