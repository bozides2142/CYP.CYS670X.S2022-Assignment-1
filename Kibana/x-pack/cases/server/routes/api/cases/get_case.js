"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initGetCaseApi = initGetCaseApi;

var _configSchema = require("@kbn/config-schema");

var _utils = require("../utils");

var _constants = require("../../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function initGetCaseApi({
  router,
  logger,
  kibanaVersion
}) {
  router.get({
    path: _constants.CASE_DETAILS_URL,
    validate: {
      params: _configSchema.schema.object({
        case_id: _configSchema.schema.string()
      }),
      query: _configSchema.schema.object({
        /**
         * @deprecated since version 8.1.0
         */
        includeComments: _configSchema.schema.boolean({
          defaultValue: true
        })
      })
    }
  }, async (context, request, response) => {
    try {
      const isIncludeCommentsParamProvidedByTheUser = request.url.searchParams.has('includeComments');

      if (isIncludeCommentsParamProvidedByTheUser) {
        (0, _utils.logDeprecatedEndpoint)(logger, request.headers, `The query parameter 'includeComments' of the get case API '${_constants.CASE_DETAILS_URL}' is deprecated`);
      }

      const casesClient = await context.cases.getCasesClient();
      const id = request.params.case_id;
      return response.ok({ ...(isIncludeCommentsParamProvidedByTheUser && {
          headers: { ...(0, _utils.getWarningHeader)(kibanaVersion, 'Deprecated query parameter includeComments')
          }
        }),
        body: await casesClient.cases.get({
          id,
          includeComments: request.query.includeComments
        })
      });
    } catch (error) {
      logger.error(`Failed to retrieve case in route case id: ${request.params.case_id} \ninclude comments: ${request.query.includeComments}: ${error}`);
      return response.customError((0, _utils.wrapError)(error));
    }
  });
  router.get({
    path: `${_constants.CASE_DETAILS_URL}/resolve`,
    validate: {
      params: _configSchema.schema.object({
        case_id: _configSchema.schema.string()
      }),
      query: _configSchema.schema.object({
        includeComments: _configSchema.schema.boolean({
          defaultValue: true
        })
      })
    }
  }, async (context, request, response) => {
    try {
      const casesClient = await context.cases.getCasesClient();
      const id = request.params.case_id;
      return response.ok({
        body: await casesClient.cases.resolve({
          id,
          includeComments: request.query.includeComments
        })
      });
    } catch (error) {
      logger.error(`Failed to retrieve case in resolve route case id: ${request.params.case_id} \ninclude comments: ${request.query.includeComments}: ${error}`);
      return response.customError((0, _utils.wrapError)(error));
    }
  });
}