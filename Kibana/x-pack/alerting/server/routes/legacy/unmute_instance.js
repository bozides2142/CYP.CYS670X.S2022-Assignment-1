"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unmuteAlertInstanceRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _license_api_access = require("../../lib/license_api_access");

var _common = require("../../../common");

var _alert_type_disabled = require("../../lib/errors/alert_type_disabled");

var _track_legacy_route_usage = require("../../lib/track_legacy_route_usage");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const paramSchema = _configSchema.schema.object({
  alertId: _configSchema.schema.string(),
  alertInstanceId: _configSchema.schema.string()
});

const unmuteAlertInstanceRoute = (router, licenseState, usageCounter) => {
  router.post({
    path: `${_common.LEGACY_BASE_ALERT_API_PATH}/alert/{alertId}/alert_instance/{alertInstanceId}/_unmute`,
    validate: {
      params: paramSchema
    }
  }, router.handleLegacyErrors(async function (context, req, res) {
    (0, _license_api_access.verifyApiAccess)(licenseState);

    if (!context.alerting) {
      return res.badRequest({
        body: 'RouteHandlerContext is not registered for alerting'
      });
    }

    (0, _track_legacy_route_usage.trackLegacyRouteUsage)('unmuteInstance', usageCounter);
    const rulesClient = context.alerting.getRulesClient();
    const {
      alertId,
      alertInstanceId
    } = req.params;

    try {
      await rulesClient.unmuteInstance({
        alertId,
        alertInstanceId
      });
      return res.noContent();
    } catch (e) {
      if (e instanceof _alert_type_disabled.AlertTypeDisabledError) {
        return e.sendResponse(res);
      }

      throw e;
    }
  }));
};

exports.unmuteAlertInstanceRoute = unmuteAlertInstanceRoute;