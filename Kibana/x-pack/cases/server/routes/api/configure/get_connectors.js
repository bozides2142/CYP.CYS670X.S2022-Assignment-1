"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initCaseConfigureGetActionConnector = initCaseConfigureGetActionConnector;

var _utils = require("../utils");

var _constants = require("../../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 * Be aware that this api will only return 20 connectors
 */


function initCaseConfigureGetActionConnector({
  router,
  logger
}) {
  router.get({
    path: `${_constants.CASE_CONFIGURE_CONNECTORS_URL}/_find`,
    validate: false
  }, async (context, request, response) => {
    try {
      const client = await context.cases.getCasesClient();
      return response.ok({
        body: await client.configure.getConnectors()
      });
    } catch (error) {
      logger.error(`Failed to get connectors in route: ${error}`);
      return response.customError((0, _utils.wrapError)(error));
    }
  });
}