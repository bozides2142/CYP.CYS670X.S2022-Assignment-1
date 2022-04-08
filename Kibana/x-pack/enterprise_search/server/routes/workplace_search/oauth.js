"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerOAuthAuthorizeAcceptRoute = registerOAuthAuthorizeAcceptRoute;
exports.registerOAuthAuthorizeDenyRoute = registerOAuthAuthorizeDenyRoute;
exports.registerOAuthAuthorizeRoute = registerOAuthAuthorizeRoute;
exports.registerOAuthRoutes = void 0;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerOAuthAuthorizeRoute({
  router,
  enterpriseSearchRequestHandler
}) {
  router.get({
    path: '/internal/workplace_search/oauth/authorize',
    validate: {
      query: _configSchema.schema.object({
        access_type: _configSchema.schema.maybe(_configSchema.schema.string()),
        client_id: _configSchema.schema.string(),
        code_challenge: _configSchema.schema.maybe(_configSchema.schema.string()),
        code_challenge_method: _configSchema.schema.maybe(_configSchema.schema.string()),
        response_type: _configSchema.schema.string(),
        response_mode: _configSchema.schema.maybe(_configSchema.schema.string()),
        redirect_uri: _configSchema.schema.maybe(_configSchema.schema.string()),
        scope: _configSchema.schema.maybe(_configSchema.schema.string()),
        state: _configSchema.schema.nullable(_configSchema.schema.string())
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/oauth/authorize'
  }));
}

function registerOAuthAuthorizeAcceptRoute({
  router,
  enterpriseSearchRequestHandler
}) {
  router.post({
    path: '/internal/workplace_search/oauth/authorize',
    validate: {
      body: _configSchema.schema.object({
        client_id: _configSchema.schema.string(),
        response_type: _configSchema.schema.string(),
        redirect_uri: _configSchema.schema.maybe(_configSchema.schema.string()),
        scope: _configSchema.schema.maybe(_configSchema.schema.string()),
        state: _configSchema.schema.nullable(_configSchema.schema.string())
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/oauth/authorize'
  }));
}

function registerOAuthAuthorizeDenyRoute({
  router,
  enterpriseSearchRequestHandler
}) {
  router.delete({
    path: '/internal/workplace_search/oauth/authorize',
    validate: {
      body: _configSchema.schema.object({
        client_id: _configSchema.schema.string(),
        response_type: _configSchema.schema.string(),
        redirect_uri: _configSchema.schema.maybe(_configSchema.schema.string()),
        scope: _configSchema.schema.maybe(_configSchema.schema.string()),
        state: _configSchema.schema.nullable(_configSchema.schema.string())
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/oauth/authorize'
  }));
}

const registerOAuthRoutes = dependencies => {
  registerOAuthAuthorizeRoute(dependencies);
  registerOAuthAuthorizeAcceptRoute(dependencies);
  registerOAuthAuthorizeDenyRoute(dependencies);
};

exports.registerOAuthRoutes = registerOAuthRoutes;