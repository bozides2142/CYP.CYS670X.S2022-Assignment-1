"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createActionRoute = exports.bodySchema = void 0;

var _configSchema = require("@kbn/config-schema");

var _common = require("../../../common");

var _verify_access_and_context = require("../verify_access_and_context");

var _track_legacy_route_usage = require("../../lib/track_legacy_route_usage");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const bodySchema = _configSchema.schema.object({
  name: _configSchema.schema.string(),
  actionTypeId: _configSchema.schema.string(),
  config: _configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.any(), {
    defaultValue: {}
  }),
  secrets: _configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.any(), {
    defaultValue: {}
  })
});

exports.bodySchema = bodySchema;

const createActionRoute = (router, licenseState, usageCounter) => {
  router.post({
    path: `${_common.BASE_ACTION_API_PATH}/action`,
    validate: {
      body: bodySchema
    }
  }, router.handleLegacyErrors((0, _verify_access_and_context.verifyAccessAndContext)(licenseState, async function (context, req, res) {
    const actionsClient = context.actions.getActionsClient();
    const action = req.body;
    (0, _track_legacy_route_usage.trackLegacyRouteUsage)('create', usageCounter);
    return res.ok({
      body: await actionsClient.create({
        action
      })
    });
  })));
};

exports.createActionRoute = createActionRoute;