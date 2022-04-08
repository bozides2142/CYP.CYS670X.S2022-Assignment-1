"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerSearchSettingsRoutes = registerSearchSettingsRoutes;

var _configSchema = require("@kbn/config-schema");

var _route_config_helpers = require("../../lib/route_config_helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerSearchSettingsRoutes({
  router,
  enterpriseSearchRequestHandler
}) {
  router.get({
    path: '/internal/app_search/engines/{engineName}/search_settings/details',
    validate: {
      params: _configSchema.schema.object({
        engineName: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/as/engines/:engineName/search_settings/details'
  }));
  router.post({
    path: '/internal/app_search/engines/{engineName}/search_settings/reset',
    validate: {
      params: _configSchema.schema.object({
        engineName: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/as/engines/:engineName/search_settings/reset'
  }));
  router.put((0, _route_config_helpers.skipBodyValidation)({
    path: '/internal/app_search/engines/{engineName}/search_settings',
    validate: {
      params: _configSchema.schema.object({
        engineName: _configSchema.schema.string()
      })
    }
  }), enterpriseSearchRequestHandler.createRequest({
    path: '/as/engines/:engineName/search_settings'
  }));
}