"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateAlertRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _license_api_access = require("../../lib/license_api_access");

var _lib = require("../../lib");

var _error_handler = require("./../lib/error_handler");

var _alert_type_disabled = require("../../lib/errors/alert_type_disabled");

var _track_legacy_route_usage = require("../../lib/track_legacy_route_usage");

var _common = require("../../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const paramSchema = _configSchema.schema.object({
  id: _configSchema.schema.string()
});

const bodySchema = _configSchema.schema.object({
  name: _configSchema.schema.string(),
  tags: _configSchema.schema.arrayOf(_configSchema.schema.string(), {
    defaultValue: []
  }),
  schedule: _configSchema.schema.object({
    interval: _configSchema.schema.string({
      validate: _lib.validateDurationSchema
    })
  }),
  throttle: _configSchema.schema.nullable(_configSchema.schema.string({
    validate: _lib.validateDurationSchema
  })),
  params: _configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.any(), {
    defaultValue: {}
  }),
  actions: _configSchema.schema.arrayOf(_configSchema.schema.object({
    group: _configSchema.schema.string(),
    id: _configSchema.schema.string(),
    params: _configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.any(), {
      defaultValue: {}
    }),
    actionTypeId: _configSchema.schema.maybe(_configSchema.schema.string())
  }), {
    defaultValue: []
  }),
  notifyWhen: _configSchema.schema.nullable(_configSchema.schema.string({
    validate: _common.validateNotifyWhenType
  }))
});

const updateAlertRoute = (router, licenseState, usageCounter) => {
  router.put({
    path: `${_common.LEGACY_BASE_ALERT_API_PATH}/alert/{id}`,
    validate: {
      body: bodySchema,
      params: paramSchema
    }
  }, (0, _error_handler.handleDisabledApiKeysError)(router.handleLegacyErrors(async function (context, req, res) {
    (0, _license_api_access.verifyApiAccess)(licenseState);

    if (!context.alerting) {
      return res.badRequest({
        body: 'RouteHandlerContext is not registered for alerting'
      });
    }

    (0, _track_legacy_route_usage.trackLegacyRouteUsage)('update', usageCounter);
    const rulesClient = context.alerting.getRulesClient();
    const {
      id
    } = req.params;
    const {
      name,
      actions,
      params,
      schedule,
      tags,
      throttle,
      notifyWhen
    } = req.body;

    try {
      const alertRes = await rulesClient.update({
        id,
        data: {
          name,
          actions,
          params,
          schedule,
          tags,
          throttle,
          notifyWhen: notifyWhen
        }
      });
      return res.ok({
        body: alertRes
      });
    } catch (e) {
      if (e instanceof _alert_type_disabled.AlertTypeDisabledError) {
        return e.sendResponse(res);
      }

      throw e;
    }
  })));
};

exports.updateAlertRoute = updateAlertRoute;