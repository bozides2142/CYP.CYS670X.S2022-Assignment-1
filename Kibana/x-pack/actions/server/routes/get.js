"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getActionRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _common = require("../../common");

var _verify_access_and_context = require("./verify_access_and_context");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const paramSchema = _configSchema.schema.object({
  id: _configSchema.schema.string()
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

const getActionRoute = (router, licenseState) => {
  router.get({
    path: `${_common.BASE_ACTION_API_PATH}/connector/{id}`,
    validate: {
      params: paramSchema
    }
  }, router.handleLegacyErrors((0, _verify_access_and_context.verifyAccessAndContext)(licenseState, async function (context, req, res) {
    const actionsClient = context.actions.getActionsClient();
    const {
      id
    } = req.params;
    return res.ok({
      body: rewriteBodyRes(await actionsClient.get({
        id
      }))
    });
  })));
};

exports.getActionRoute = getActionRoute;