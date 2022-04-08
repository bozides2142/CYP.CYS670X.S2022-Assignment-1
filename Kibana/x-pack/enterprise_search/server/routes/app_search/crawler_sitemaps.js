"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerCrawlerSitemapRoutes = registerCrawlerSitemapRoutes;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerCrawlerSitemapRoutes({
  router,
  enterpriseSearchRequestHandler
}) {
  router.post({
    path: '/internal/app_search/engines/{engineName}/crawler/domains/{domainId}/sitemaps',
    validate: {
      params: _configSchema.schema.object({
        engineName: _configSchema.schema.string(),
        domainId: _configSchema.schema.string()
      }),
      body: _configSchema.schema.object({
        url: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/api/as/v1/engines/:engineName/crawler/domains/:domainId/sitemaps',
    params: {
      respond_with: 'index'
    }
  }));
  router.put({
    path: '/internal/app_search/engines/{engineName}/crawler/domains/{domainId}/sitemaps/{sitemapId}',
    validate: {
      params: _configSchema.schema.object({
        engineName: _configSchema.schema.string(),
        domainId: _configSchema.schema.string(),
        sitemapId: _configSchema.schema.string()
      }),
      body: _configSchema.schema.object({
        url: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/api/as/v1/engines/:engineName/crawler/domains/:domainId/sitemaps/:sitemapId',
    params: {
      respond_with: 'index'
    }
  }));
  router.delete({
    path: '/internal/app_search/engines/{engineName}/crawler/domains/{domainId}/sitemaps/{sitemapId}',
    validate: {
      params: _configSchema.schema.object({
        engineName: _configSchema.schema.string(),
        domainId: _configSchema.schema.string(),
        sitemapId: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/api/as/v1/engines/:engineName/crawler/domains/:domainId/sitemaps/:sitemapId',
    params: {
      respond_with: 'index'
    }
  }));
}