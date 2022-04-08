"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerEnginesRoutes = registerEnginesRoutes;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerEnginesRoutes({
  router,
  enterpriseSearchRequestHandler
}) {
  router.get({
    path: '/internal/app_search/engines',
    validate: {
      query: _configSchema.schema.object({
        type: _configSchema.schema.oneOf([_configSchema.schema.literal('indexed'), _configSchema.schema.literal('meta')]),
        'page[current]': _configSchema.schema.number(),
        'page[size]': _configSchema.schema.number()
      })
    }
  }, async (context, request, response) => {
    return enterpriseSearchRequestHandler.createRequest({
      path: '/as/engines/collection',
      hasValidData: body => {
        var _body$meta, _body$meta$page;

        return Array.isArray(body === null || body === void 0 ? void 0 : body.results) && typeof (body === null || body === void 0 ? void 0 : (_body$meta = body.meta) === null || _body$meta === void 0 ? void 0 : (_body$meta$page = _body$meta.page) === null || _body$meta$page === void 0 ? void 0 : _body$meta$page.total_results) === 'number';
      }
    })(context, request, response);
  });
  router.post({
    path: '/internal/app_search/engines',
    validate: {
      body: _configSchema.schema.object({
        name: _configSchema.schema.string(),
        language: _configSchema.schema.maybe(_configSchema.schema.string()),
        source_engines: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string())),
        type: _configSchema.schema.maybe(_configSchema.schema.string())
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/as/engines/collection'
  })); // Single engine endpoints

  router.get({
    path: '/internal/app_search/engines/{name}',
    validate: {
      params: _configSchema.schema.object({
        name: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/as/engines/:name/details'
  }));
  router.delete({
    path: '/internal/app_search/engines/{name}',
    validate: {
      params: _configSchema.schema.object({
        name: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/as/engines/:name'
  }));
  router.get({
    path: '/internal/app_search/engines/{name}/overview',
    validate: {
      params: _configSchema.schema.object({
        name: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/as/engines/:name/overview_metrics'
  }));
}