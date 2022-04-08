"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerApiLogsRoutes = registerApiLogsRoutes;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerApiLogsRoutes({
  router,
  enterpriseSearchRequestHandler
}) {
  router.get({
    path: '/internal/app_search/engines/{engineName}/api_logs',
    validate: {
      params: _configSchema.schema.object({
        engineName: _configSchema.schema.string()
      }),
      query: _configSchema.schema.object({
        'filters[date][from]': _configSchema.schema.string(),
        // Date string, expected format: ISO string
        'filters[date][to]': _configSchema.schema.string(),
        // Date string, expected format: ISO string
        'page[current]': _configSchema.schema.number(),
        sort_direction: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/as/engines/:engineName/api_logs/collection'
  }));
}