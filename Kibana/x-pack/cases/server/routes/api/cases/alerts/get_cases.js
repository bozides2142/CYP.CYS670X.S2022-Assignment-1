"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initGetCasesByAlertIdApi = initGetCasesByAlertIdApi;

var _configSchema = require("@kbn/config-schema");

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _utils = require("../../utils");

var _constants = require("../../../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function initGetCasesByAlertIdApi({
  router,
  logger
}) {
  router.get({
    path: _constants.CASE_ALERTS_URL,
    validate: {
      params: _configSchema.schema.object({
        alert_id: _configSchema.schema.string()
      }),
      query: _utils.escapeHatch
    }
  }, async (context, request, response) => {
    try {
      const alertID = request.params.alert_id;

      if (alertID == null || alertID === '') {
        throw _boom.default.badRequest('The `alertId` is not valid');
      }

      const casesClient = await context.cases.getCasesClient();
      const options = request.query;
      return response.ok({
        body: await casesClient.cases.getCasesByAlertID({
          alertID,
          options
        })
      });
    } catch (error) {
      logger.error(`Failed to retrieve case ids for this alert id: ${request.params.alert_id}: ${error}`);
      return response.customError((0, _utils.wrapError)(error));
    }
  });
}