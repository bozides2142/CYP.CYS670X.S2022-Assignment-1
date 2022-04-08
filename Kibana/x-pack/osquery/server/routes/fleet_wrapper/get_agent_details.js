"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAgentDetailsRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _common = require("../../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getAgentDetailsRoute = (router, osqueryContext) => {
  router.get({
    path: '/internal/osquery/fleet_wrapper/agents/{id}',
    validate: {
      params: _configSchema.schema.object({}, {
        unknowns: 'allow'
      })
    },
    options: {
      tags: [`access:${_common.PLUGIN_ID}-read`]
    }
  }, async (context, request, response) => {
    let agent;

    try {
      var _osqueryContext$servi, _osqueryContext$servi2;

      agent = await ((_osqueryContext$servi = osqueryContext.service.getAgentService()) === null || _osqueryContext$servi === void 0 ? void 0 : (_osqueryContext$servi2 = _osqueryContext$servi.asInternalUser // @ts-expect-error update types
      ) === null || _osqueryContext$servi2 === void 0 ? void 0 : _osqueryContext$servi2.getAgent(request.params.id));
    } catch (err) {
      return response.notFound();
    }

    return response.ok({
      body: {
        item: agent
      }
    });
  });
};

exports.getAgentDetailsRoute = getAgentDetailsRoute;