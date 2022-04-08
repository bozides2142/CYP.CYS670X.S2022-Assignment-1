"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerSourceEnginesRoutes = registerSourceEnginesRoutes;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerSourceEnginesRoutes({
  router,
  enterpriseSearchRequestHandler
}) {
  router.get({
    path: '/internal/app_search/engines/{name}/source_engines',
    validate: {
      params: _configSchema.schema.object({
        name: _configSchema.schema.string()
      }),
      query: _configSchema.schema.object({
        'page[current]': _configSchema.schema.number(),
        'page[size]': _configSchema.schema.number()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/as/engines/:name/source_engines'
  }));
  router.post({
    path: '/internal/app_search/engines/{name}/source_engines/bulk_create',
    validate: {
      params: _configSchema.schema.object({
        name: _configSchema.schema.string()
      }),
      body: _configSchema.schema.object({
        source_engine_slugs: _configSchema.schema.arrayOf(_configSchema.schema.string())
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/as/engines/:name/source_engines/bulk_create',
    hasJsonResponse: false
  }));
  router.delete({
    path: '/internal/app_search/engines/{name}/source_engines/{source_engine_name}',
    validate: {
      params: _configSchema.schema.object({
        name: _configSchema.schema.string(),
        source_engine_name: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/as/engines/:name/source_engines/:source_engine_name',
    hasJsonResponse: false
  }));
}