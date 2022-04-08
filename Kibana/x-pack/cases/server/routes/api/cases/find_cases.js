"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initFindCasesApi = initFindCasesApi;

var _constants = require("../../../../common/constants");

var _utils = require("../utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function initFindCasesApi({
  router,
  logger
}) {
  router.get({
    path: `${_constants.CASES_URL}/_find`,
    validate: {
      query: _utils.escapeHatch
    }
  }, async (context, request, response) => {
    try {
      if (!context.cases) {
        return response.badRequest({
          body: 'RouteHandlerContext is not registered for cases'
        });
      }

      const casesClient = await context.cases.getCasesClient();
      const options = request.query;
      return response.ok({
        body: await casesClient.cases.find({ ...options
        })
      });
    } catch (error) {
      logger.error(`Failed to find cases in route: ${error}`);
      return response.customError((0, _utils.wrapError)(error));
    }
  });
}