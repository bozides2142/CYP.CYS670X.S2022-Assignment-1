"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerSynonymsRoutes = registerSynonymsRoutes;

var _configSchema = require("@kbn/config-schema");

var _route_config_helpers = require("../../lib/route_config_helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerSynonymsRoutes({
  router,
  enterpriseSearchRequestHandler
}) {
  router.get({
    path: '/internal/app_search/engines/{engineName}/synonyms',
    validate: {
      params: _configSchema.schema.object({
        engineName: _configSchema.schema.string()
      }),
      query: _configSchema.schema.object({
        'page[current]': _configSchema.schema.number(),
        'page[size]': _configSchema.schema.number()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/as/engines/:engineName/synonyms/collection'
  }));
  router.post((0, _route_config_helpers.skipBodyValidation)({
    path: '/internal/app_search/engines/{engineName}/synonyms',
    validate: {
      params: _configSchema.schema.object({
        engineName: _configSchema.schema.string()
      })
    }
  }), enterpriseSearchRequestHandler.createRequest({
    path: '/as/engines/:engineName/synonyms/collection'
  }));
  router.put((0, _route_config_helpers.skipBodyValidation)({
    path: '/internal/app_search/engines/{engineName}/synonyms/{synonymId}',
    validate: {
      params: _configSchema.schema.object({
        engineName: _configSchema.schema.string(),
        synonymId: _configSchema.schema.string()
      })
    }
  }), enterpriseSearchRequestHandler.createRequest({
    path: '/as/engines/:engineName/synonyms/:synonymId'
  }));
  router.delete({
    path: '/internal/app_search/engines/{engineName}/synonyms/{synonymId}',
    validate: {
      params: _configSchema.schema.object({
        engineName: _configSchema.schema.string(),
        synonymId: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/as/engines/:engineName/synonyms/:synonymId'
  }));
}