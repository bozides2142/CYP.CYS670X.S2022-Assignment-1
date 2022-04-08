"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAgentPolicyRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _common = require("../../../common");

var _collector = require("../../usage/collector");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getAgentPolicyRoute = (router, osqueryContext) => {
  router.get({
    path: '/internal/osquery/fleet_wrapper/agent_policies/{id}',
    validate: {
      params: _configSchema.schema.object({
        id: _configSchema.schema.string()
      })
    },
    options: {
      tags: [`access:${_common.PLUGIN_ID}-read`]
    }
  }, async (context, request, response) => {
    var _osqueryContext$servi;

    const internalSavedObjectsClient = await (0, _collector.getInternalSavedObjectsClient)(osqueryContext.getStartServices);
    const packageInfo = await ((_osqueryContext$servi = osqueryContext.service.getAgentPolicyService()) === null || _osqueryContext$servi === void 0 ? void 0 : _osqueryContext$servi.get(internalSavedObjectsClient, request.params.id));
    return response.ok({
      body: {
        item: packageInfo
      }
    });
  });
};

exports.getAgentPolicyRoute = getAgentPolicyRoute;