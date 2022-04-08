"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.find = void 0;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _pipeable = require("fp-ts/lib/pipeable");

var _Either = require("fp-ts/lib/Either");

var _function = require("fp-ts/lib/function");

var _api = require("../../../common/api");

var _error = require("../../common/error");

var _utils = require("../../common/utils");

var _utils2 = require("../utils");

var _utils3 = require("../../authorization/utils");

var _authorization = require("../../authorization");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Retrieves a case and optionally its comments.
 *
 * @ignore
 */


const find = async (params, clientArgs) => {
  const {
    unsecuredSavedObjectsClient,
    caseService,
    authorization,
    logger
  } = clientArgs;

  try {
    const queryParams = (0, _pipeable.pipe)((0, _api.excess)(_api.CasesFindRequestRt).decode(params), (0, _Either.fold)((0, _api.throwErrors)(_boom.default.badRequest), _function.identity));
    const {
      filter: authorizationFilter,
      ensureSavedObjectsAreAuthorized
    } = await authorization.getAuthorizationFilter(_authorization.Operations.findCases);
    const queryArgs = {
      tags: queryParams.tags,
      reporters: queryParams.reporters,
      sortByField: queryParams.sortField,
      status: queryParams.status,
      owner: queryParams.owner
    };
    const caseQueries = (0, _utils2.constructQueryOptions)({ ...queryArgs,
      authorizationFilter
    });
    const cases = await caseService.findCasesGroupedByID({
      unsecuredSavedObjectsClient,
      caseOptions: { ...queryParams,
        ...caseQueries,
        searchFields: queryParams.searchFields != null ? Array.isArray(queryParams.searchFields) ? queryParams.searchFields : [queryParams.searchFields] : queryParams.searchFields,
        fields: (0, _utils3.includeFieldsRequiredForAuthentication)(queryParams.fields)
      }
    });
    ensureSavedObjectsAreAuthorized([...cases.casesMap.values()]); // casesStatuses are bounded by us. No need to limit concurrent calls.

    const [openCases, inProgressCases, closedCases] = await Promise.all([..._api.caseStatuses.map(status => {
      const statusQuery = (0, _utils2.constructQueryOptions)({ ...queryArgs,
        status,
        authorizationFilter
      });
      return caseService.findCaseStatusStats({
        unsecuredSavedObjectsClient,
        caseOptions: statusQuery,
        ensureSavedObjectsAreAuthorized
      });
    })]);
    return _api.CasesFindResponseRt.encode((0, _utils.transformCases)({
      casesMap: cases.casesMap,
      page: cases.page,
      perPage: cases.perPage,
      total: cases.total,
      countOpenCases: openCases,
      countInProgressCases: inProgressCases,
      countClosedCases: closedCases
    }));
  } catch (error) {
    throw (0, _error.createCaseError)({
      message: `Failed to find cases: ${JSON.stringify(params)}: ${error}`,
      error,
      logger
    });
  }
};

exports.find = find;