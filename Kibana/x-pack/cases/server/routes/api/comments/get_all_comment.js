"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initGetAllCommentsApi = initGetAllCommentsApi;

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


function initGetAllCommentsApi({
  router,
  logger,
  kibanaVersion
}) {
  router.get({
    path: _constants.CASE_COMMENTS_URL,
    validate: {
      params: _configSchema.schema.object({
        case_id: _configSchema.schema.string()
      })
    }
  }, async (context, request, response) => {
    try {
      (0, _utils.logDeprecatedEndpoint)(logger, request.headers, `The get all cases comments API '${_constants.CASE_COMMENTS_URL}' is deprecated.`);
      const client = await context.cases.getCasesClient();
      return response.ok({
        headers: { ...(0, _utils.getWarningHeader)(kibanaVersion)
        },
        body: await client.attachments.getAll({
          caseID: request.params.case_id
        })
      });
    } catch (error) {
      logger.error(`Failed to get all comments in route case id: ${request.params.case_id}: ${error}`);
      return response.customError((0, _utils.wrapError)(error));
    }
  });
}