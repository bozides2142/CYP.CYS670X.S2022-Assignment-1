"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initGetCaseMetricsApi = initGetCaseMetricsApi;

var _configSchema = require("@kbn/config-schema");

var _utils = require("../utils");

var _constants = require("../../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function initGetCaseMetricsApi({
  router,
  logger
}) {
  router.get({
    path: _constants.CASE_METRICS_DETAILS_URL,
    validate: {
      params: _configSchema.schema.object({
        case_id: _configSchema.schema.string({
          minLength: 1
        })
      }),
      query: _configSchema.schema.object({
        features: _configSchema.schema.arrayOf(_configSchema.schema.string({
          minLength: 1
        }))
      })
    }
  }, async (context, request, response) => {
    try {
      const client = await context.cases.getCasesClient();
      return response.ok({
        body: await client.metrics.getCaseMetrics({
          caseId: request.params.case_id,
          features: request.query.features
        })
      });
    } catch (error) {
      logger.error(`Failed to get case metrics in route: ${error}`);
      return response.customError((0, _utils.wrapError)(error));
    }
  });
}