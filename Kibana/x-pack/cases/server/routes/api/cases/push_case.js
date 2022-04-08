"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initPushCaseApi = initPushCaseApi;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _pipeable = require("fp-ts/lib/pipeable");

var _Either = require("fp-ts/lib/Either");

var _function = require("fp-ts/lib/function");

var _utils = require("../utils");

var _api = require("../../../../common/api");

var _constants = require("../../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function initPushCaseApi({
  router,
  logger
}) {
  router.post({
    path: _constants.CASE_PUSH_URL,
    validate: {
      params: _utils.escapeHatch,
      body: _utils.escapeHatch
    }
  }, async (context, request, response) => {
    try {
      if (!context.cases) {
        return response.badRequest({
          body: 'RouteHandlerContext is not registered for cases'
        });
      }

      const casesClient = await context.cases.getCasesClient();
      const params = (0, _pipeable.pipe)(_api.CasePushRequestParamsRt.decode(request.params), (0, _Either.fold)((0, _api.throwErrors)(_boom.default.badRequest), _function.identity));
      return response.ok({
        body: await casesClient.cases.push({
          caseId: params.case_id,
          connectorId: params.connector_id
        })
      });
    } catch (error) {
      logger.error(`Failed to push case in route: ${error}`);
      return response.customError((0, _utils.wrapError)(error));
    }
  });
}