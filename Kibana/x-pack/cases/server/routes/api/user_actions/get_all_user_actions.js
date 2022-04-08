"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initGetAllCaseUserActionsApi = initGetAllCaseUserActionsApi;

var _configSchema = require("@kbn/config-schema");

var _utils = require("../utils");

var _constants = require("../../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * @deprecated since version 8.1.0
 */


function initGetAllCaseUserActionsApi({
  router,
  logger,
  kibanaVersion
}) {
  router.get({
    path: _constants.CASE_USER_ACTIONS_URL,
    validate: {
      params: _configSchema.schema.object({
        case_id: _configSchema.schema.string()
      })
    }
  }, async (context, request, response) => {
    try {
      if (!context.cases) {
        return response.badRequest({
          body: 'RouteHandlerContext is not registered for cases'
        });
      }

      (0, _utils.logDeprecatedEndpoint)(logger, request.headers, `The get all cases user actions API '${_constants.CASE_USER_ACTIONS_URL}' is deprecated.`);
      const casesClient = await context.cases.getCasesClient();
      const caseId = request.params.case_id;
      return response.ok({
        headers: { ...(0, _utils.getWarningHeader)(kibanaVersion)
        },
        body: await casesClient.userActions.getAll({
          caseId
        })
      });
    } catch (error) {
      logger.error(`Failed to retrieve case user actions in route case id: ${request.params.case_id}: ${error}`);
      return response.customError((0, _utils.wrapError)(error));
    }
  });
}