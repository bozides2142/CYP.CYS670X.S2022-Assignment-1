"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.executeActionRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _common = require("../../common");

var _action_execution_source = require("../lib/action_execution_source");

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

const bodySchema = _configSchema.schema.object({
  params: _configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.any())
});

const rewriteBodyRes = ({
  actionId,
  serviceMessage,
  ...res
}) => ({ ...res,
  connector_id: actionId,
  ...(serviceMessage ? {
    service_message: serviceMessage
  } : {})
});

const executeActionRoute = (router, licenseState) => {
  router.post({
    path: `${_common.BASE_ACTION_API_PATH}/connector/{id}/_execute`,
    validate: {
      body: bodySchema,
      params: paramSchema
    }
  }, router.handleLegacyErrors((0, _verify_access_and_context.verifyAccessAndContext)(licenseState, async function (context, req, res) {
    const actionsClient = context.actions.getActionsClient();
    const {
      params
    } = req.body;
    const {
      id
    } = req.params;
    const body = await actionsClient.execute({
      params,
      actionId: id,
      source: (0, _action_execution_source.asHttpRequestExecutionSource)(req),
      relatedSavedObjects: []
    });
    return body ? res.ok({
      body: rewriteBodyRes(body)
    }) : res.noContent();
  })));
};

exports.executeActionRoute = executeActionRoute;