"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerSearchRelevanceSuggestionsRoutes = registerSearchRelevanceSuggestionsRoutes;

var _configSchema = require("@kbn/config-schema");

var _route_config_helpers = require("../../lib/route_config_helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerSearchRelevanceSuggestionsRoutes({
  router,
  enterpriseSearchRequestHandler
}) {
  router.post({
    path: '/internal/app_search/engines/{engineName}/adaptive_relevance/suggestions',
    validate: {
      params: _configSchema.schema.object({
        engineName: _configSchema.schema.string()
      }),
      body: _configSchema.schema.object({
        page: _configSchema.schema.object({
          current: _configSchema.schema.number(),
          size: _configSchema.schema.number()
        }),
        filters: _configSchema.schema.object({
          status: _configSchema.schema.arrayOf(_configSchema.schema.string()),
          type: _configSchema.schema.string()
        })
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/api/as/v0/engines/:engineName/adaptive_relevance/suggestions'
  }));
  router.put((0, _route_config_helpers.skipBodyValidation)({
    path: '/internal/app_search/engines/{engineName}/adaptive_relevance/suggestions',
    validate: {
      params: _configSchema.schema.object({
        engineName: _configSchema.schema.string()
      })
    }
  }), enterpriseSearchRequestHandler.createRequest({
    path: '/api/as/v0/engines/:engineName/adaptive_relevance/suggestions'
  }));
  router.get({
    path: '/internal/app_search/engines/{engineName}/adaptive_relevance/settings',
    validate: {
      params: _configSchema.schema.object({
        engineName: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/api/as/v0/engines/:engineName/adaptive_relevance/settings'
  }));
  router.put((0, _route_config_helpers.skipBodyValidation)({
    path: '/internal/app_search/engines/{engineName}/adaptive_relevance/settings',
    validate: {
      params: _configSchema.schema.object({
        engineName: _configSchema.schema.string()
      })
    }
  }), enterpriseSearchRequestHandler.createRequest({
    path: '/api/as/v0/engines/:engineName/adaptive_relevance/settings'
  }));
  router.get({
    path: '/internal/app_search/engines/{engineName}/adaptive_relevance/suggestions/{query}',
    validate: {
      params: _configSchema.schema.object({
        engineName: _configSchema.schema.string(),
        query: _configSchema.schema.string()
      }),
      query: _configSchema.schema.object({
        type: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/as/engines/:engineName/adaptive_relevance/suggestions/:query'
  }));
}