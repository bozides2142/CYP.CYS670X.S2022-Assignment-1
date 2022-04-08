"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initGetAllAlertsAttachToCaseApi = initGetAllAlertsAttachToCaseApi;

var _configSchema = require("@kbn/config-schema");

var _utils = require("../utils");

var _constants = require("../../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function initGetAllAlertsAttachToCaseApi({
  router,
  logger
}) {
  router.get({
    path: _constants.CASE_DETAILS_ALERTS_URL,
    validate: {
      params: _configSchema.schema.object({
        case_id: _configSchema.schema.string({
          minLength: 1
        })
      })
    }
  }, async (context, request, response) => {
    try {
      const caseId = request.params.case_id;
      const casesClient = await context.cases.getCasesClient();
      return response.ok({
        body: await casesClient.attachments.getAllAlertsAttachToCase({
          caseId
        })
      });
    } catch (error) {
      logger.error(`Failed to retrieve alert ids for this case id: ${request.params.case_id}: ${error}`);
      return response.customError((0, _utils.wrapError)(error));
    }
  });
}