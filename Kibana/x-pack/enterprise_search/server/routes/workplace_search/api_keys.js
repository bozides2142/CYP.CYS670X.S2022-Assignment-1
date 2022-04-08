"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerApiKeysRoute = registerApiKeysRoute;
exports.registerApiKeysRoutes = void 0;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerApiKeysRoute({
  router,
  enterpriseSearchRequestHandler
}) {
  router.get({
    path: '/internal/workplace_search/api_keys',
    validate: false
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/org/api_tokens'
  }));
  router.post({
    path: '/internal/workplace_search/api_keys',
    validate: {
      body: _configSchema.schema.object({
        name: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/org/api_tokens'
  }));
  router.delete({
    path: '/internal/workplace_search/api_keys/{tokenName}',
    validate: {
      params: _configSchema.schema.object({
        tokenName: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/org/api_tokens/:tokenName'
  }));
}

const registerApiKeysRoutes = dependencies => {
  registerApiKeysRoute(dependencies);
};

exports.registerApiKeysRoutes = registerApiKeysRoutes;