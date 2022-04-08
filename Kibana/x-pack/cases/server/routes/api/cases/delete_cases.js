"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initDeleteCasesApi = initDeleteCasesApi;

var _configSchema = require("@kbn/config-schema");

var _utils = require("../utils");

var _constants = require("../../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function initDeleteCasesApi({
  router,
  logger
}) {
  router.delete({
    path: _constants.CASES_URL,
    validate: {
      query: _configSchema.schema.object({
        ids: _configSchema.schema.arrayOf(_configSchema.schema.string())
      })
    }
  }, async (context, request, response) => {
    try {
      const client = await context.cases.getCasesClient();
      await client.cases.delete(request.query.ids);
      return response.noContent();
    } catch (error) {
      logger.error(`Failed to delete cases in route ids: ${JSON.stringify(request.query.ids)}: ${error}`);
      return response.customError((0, _utils.wrapError)(error));
    }
  });
}