"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createActionRoute = exports.bodySchema = void 0;

var _configSchema = require("@kbn/config-schema");

var _common = require("../../common");

var _verify_access_and_context = require("./verify_access_and_context");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const bodySchema = _configSchema.schema.object({
  name: _configSchema.schema.string(),
  connector_type_id: _configSchema.schema.string(),
  config: _configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.any(), {
    defaultValue: {}
  }),
  secrets: _configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.any(), {
    defaultValue: {}
  })
});

exports.bodySchema = bodySchema;

const rewriteBodyReq = ({
  connector_type_id: actionTypeId,
  name,
  config,
  secrets
}) => ({
  actionTypeId,
  name,
  config,
  secrets
});

const rewriteBodyRes = ({
  actionTypeId,
  isPreconfigured,
  isMissingSecrets,
  ...res
}) => ({ ...res,
  connector_type_id: actionTypeId,
  is_preconfigured: isPreconfigured,
  is_missing_secrets: isMissingSecrets
});

const createActionRoute = (router, licenseState) => {
  router.post({
    path: `${_common.BASE_ACTION_API_PATH}/connector`,
    validate: {
      body: bodySchema
    }
  }, router.handleLegacyErrors((0, _verify_access_and_context.verifyAccessAndContext)(licenseState, async function (context, req, res) {
    const actionsClient = context.actions.getActionsClient();
    const action = rewriteBodyReq(req.body);
    return res.ok({
      body: rewriteBodyRes(await actionsClient.create({
        action
      }))
    });
  })));
};

exports.createActionRoute = createActionRoute;