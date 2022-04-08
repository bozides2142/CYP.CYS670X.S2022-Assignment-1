"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerSearchRoutes = registerSearchRoutes;

var _configSchema = require("@kbn/config-schema");

var _route_config_helpers = require("../../lib/route_config_helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerSearchRoutes({
  router,
  enterpriseSearchRequestHandler
}) {
  router.post((0, _route_config_helpers.skipBodyValidation)({
    path: '/internal/app_search/engines/{engineName}/search',
    validate: {
      params: _configSchema.schema.object({
        engineName: _configSchema.schema.string()
      }),
      query: _configSchema.schema.object({
        query: _configSchema.schema.string()
      })
    }
  }), enterpriseSearchRequestHandler.createRequest({
    path: '/as/engines/:engineName/dashboard_search'
  })); // Search UI always posts it's requests to {some_configured_base_url}/api/as/v1/engines/{engineName}/search.json
  // For that reason, we have to create a proxy url with that same suffix below, so that we can proxy Search UI
  // requests through Kibana's server.

  router.post((0, _route_config_helpers.skipBodyValidation)({
    path: '/internal/app_search/search-ui/api/as/v1/engines/{engineName}/search.json',
    validate: {
      params: _configSchema.schema.object({
        engineName: _configSchema.schema.string()
      })
    }
  }), enterpriseSearchRequestHandler.createRequest({
    path: '/as/engines/:engineName/dashboard_search'
  }));
}