"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAgentStatusForAgentPolicyRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _common = require("../../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getAgentStatusForAgentPolicyRoute = (router, osqueryContext) => {
  router.get({
    path: '/internal/osquery/fleet_wrapper/agent_status',
    validate: {
      query: _configSchema.schema.object({
        policyId: _configSchema.schema.string(),
        kuery: _configSchema.schema.maybe(_configSchema.schema.string())
      }),
      params: _configSchema.schema.object({}, {
        unknowns: 'allow'
      })
    },
    options: {
      tags: [`access:${_common.PLUGIN_ID}-read`]
    }
  }, async (context, request, response) => {
    var _osqueryContext$servi;

    const results = await ((_osqueryContext$servi = osqueryContext.service.getAgentService()) === null || _osqueryContext$servi === void 0 ? void 0 : _osqueryContext$servi.asScoped(request).getAgentStatusForAgentPolicy(request.query.policyId, request.query.kuery));

    if (!results) {
      return response.ok({
        body: {}
      });
    }

    const body = {
      results
    };
    return response.ok({
      body
    });
  });
};

exports.getAgentStatusForAgentPolicyRoute = getAgentStatusForAgentPolicyRoute;