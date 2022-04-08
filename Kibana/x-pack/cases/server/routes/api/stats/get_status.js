"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initGetCasesStatusApi = initGetCasesStatusApi;

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


function initGetCasesStatusApi({
  router,
  logger,
  kibanaVersion
}) {
  router.get({
    path: _constants.CASE_STATUS_URL,
    validate: {
      query: _utils.escapeHatch
    }
  }, async (context, request, response) => {
    try {
      (0, _utils.logDeprecatedEndpoint)(logger, request.headers, `The get cases status API '${_constants.CASE_STATUS_URL}' is deprecated.`);
      const client = await context.cases.getCasesClient();
      return response.ok({
        headers: { ...(0, _utils.getWarningHeader)(kibanaVersion)
        },
        body: await client.stats.getStatusTotalsByType(request.query)
      });
    } catch (error) {
      logger.error(`Failed to get status stats in route: ${error}`);
      return response.customError((0, _utils.wrapError)(error));
    }
  });
}