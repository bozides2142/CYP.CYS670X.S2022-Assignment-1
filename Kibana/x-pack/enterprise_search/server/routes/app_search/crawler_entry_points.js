"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerCrawlerEntryPointRoutes = registerCrawlerEntryPointRoutes;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerCrawlerEntryPointRoutes({
  router,
  enterpriseSearchRequestHandler
}) {
  router.post({
    path: '/internal/app_search/engines/{engineName}/crawler/domains/{domainId}/entry_points',
    validate: {
      params: _configSchema.schema.object({
        engineName: _configSchema.schema.string(),
        domainId: _configSchema.schema.string()
      }),
      body: _configSchema.schema.object({
        value: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/api/as/v1/engines/:engineName/crawler/domains/:domainId/entry_points',
    params: {
      respond_with: 'index'
    }
  }));
  router.put({
    path: '/internal/app_search/engines/{engineName}/crawler/domains/{domainId}/entry_points/{entryPointId}',
    validate: {
      params: _configSchema.schema.object({
        engineName: _configSchema.schema.string(),
        domainId: _configSchema.schema.string(),
        entryPointId: _configSchema.schema.string()
      }),
      body: _configSchema.schema.object({
        value: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/api/as/v1/engines/:engineName/crawler/domains/:domainId/entry_points/:entryPointId',
    params: {
      respond_with: 'index'
    }
  }));
  router.delete({
    path: '/internal/app_search/engines/{engineName}/crawler/domains/{domainId}/entry_points/{entryPointId}',
    validate: {
      params: _configSchema.schema.object({
        engineName: _configSchema.schema.string(),
        domainId: _configSchema.schema.string(),
        entryPointId: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/api/as/v1/engines/:engineName/crawler/domains/:domainId/entry_points/:entryPointId',
    params: {
      respond_with: 'index'
    }
  }));
}