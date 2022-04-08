"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerCurationsRoutes = registerCurationsRoutes;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerCurationsRoutes({
  router,
  enterpriseSearchRequestHandler
}) {
  router.get({
    path: '/internal/app_search/engines/{engineName}/curations',
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
    path: '/as/engines/:engineName/curations/collection'
  }));
  router.post({
    path: '/internal/app_search/engines/{engineName}/curations',
    validate: {
      params: _configSchema.schema.object({
        engineName: _configSchema.schema.string()
      }),
      body: _configSchema.schema.object({
        queries: _configSchema.schema.arrayOf(_configSchema.schema.string({
          minLength: 1
        }), {
          minSize: 1
        })
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/as/engines/:engineName/curations/collection'
  }));
  router.delete({
    path: '/internal/app_search/engines/{engineName}/curations/{curationId}',
    validate: {
      params: _configSchema.schema.object({
        engineName: _configSchema.schema.string(),
        curationId: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/as/engines/:engineName/curations/:curationId'
  }));
  router.get({
    path: '/internal/app_search/engines/{engineName}/curations/{curationId}',
    validate: {
      query: _configSchema.schema.object({
        skip_record_analytics: _configSchema.schema.string()
      }),
      params: _configSchema.schema.object({
        engineName: _configSchema.schema.string(),
        curationId: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/as/engines/:engineName/curations/:curationId'
  }));
  router.put({
    path: '/internal/app_search/engines/{engineName}/curations/{curationId}',
    validate: {
      query: _configSchema.schema.object({
        skip_record_analytics: _configSchema.schema.string()
      }),
      params: _configSchema.schema.object({
        engineName: _configSchema.schema.string(),
        curationId: _configSchema.schema.string()
      }),
      body: _configSchema.schema.object({
        query: _configSchema.schema.string(),
        queries: _configSchema.schema.arrayOf(_configSchema.schema.string()),
        promoted: _configSchema.schema.arrayOf(_configSchema.schema.string()),
        hidden: _configSchema.schema.arrayOf(_configSchema.schema.string())
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/as/engines/:engineName/curations/:curationId'
  }));
  router.get({
    path: '/internal/app_search/engines/{engineName}/curations/find_or_create',
    validate: {
      params: _configSchema.schema.object({
        engineName: _configSchema.schema.string()
      }),
      query: _configSchema.schema.object({
        query: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/as/engines/:engineName/curations/find_or_create'
  }));
}