"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerEnableRoleMappingsRoute = registerEnableRoleMappingsRoute;
exports.registerRoleMappingRoute = registerRoleMappingRoute;
exports.registerRoleMappingsRoute = registerRoleMappingsRoute;
exports.registerRoleMappingsRoutes = void 0;
exports.registerUserRoute = registerUserRoute;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const roleMappingBaseSchema = {
  rules: _configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.string()),
  roleType: _configSchema.schema.string(),
  engines: _configSchema.schema.arrayOf(_configSchema.schema.string()),
  accessAllEngines: _configSchema.schema.boolean()
};

function registerEnableRoleMappingsRoute({
  router,
  enterpriseSearchRequestHandler
}) {
  router.post({
    path: '/internal/app_search/role_mappings/enable_role_based_access',
    validate: false
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/as/role_mappings/enable_role_based_access'
  }));
}

function registerRoleMappingsRoute({
  router,
  enterpriseSearchRequestHandler
}) {
  router.get({
    path: '/internal/app_search/role_mappings',
    validate: false
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/as/role_mappings'
  }));
  router.post({
    path: '/internal/app_search/role_mappings',
    validate: {
      body: _configSchema.schema.object(roleMappingBaseSchema)
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/as/role_mappings'
  }));
}

function registerRoleMappingRoute({
  router,
  enterpriseSearchRequestHandler
}) {
  router.put({
    path: '/internal/app_search/role_mappings/{id}',
    validate: {
      body: _configSchema.schema.object(roleMappingBaseSchema),
      params: _configSchema.schema.object({
        id: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/as/role_mappings/:id'
  }));
  router.delete({
    path: '/internal/app_search/role_mappings/{id}',
    validate: {
      params: _configSchema.schema.object({
        id: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/as/role_mappings/:id'
  }));
}

function registerUserRoute({
  router,
  enterpriseSearchRequestHandler
}) {
  router.post({
    path: '/internal/app_search/single_user_role_mapping',
    validate: {
      body: _configSchema.schema.object({
        roleMapping: _configSchema.schema.object({
          engines: _configSchema.schema.arrayOf(_configSchema.schema.string()),
          roleType: _configSchema.schema.string(),
          accessAllEngines: _configSchema.schema.boolean(),
          id: _configSchema.schema.maybe(_configSchema.schema.string())
        }),
        elasticsearchUser: _configSchema.schema.object({
          username: _configSchema.schema.string(),
          email: _configSchema.schema.string()
        })
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/as/role_mappings/upsert_single_user_role_mapping'
  }));
}

const registerRoleMappingsRoutes = dependencies => {
  registerEnableRoleMappingsRoute(dependencies);
  registerRoleMappingsRoute(dependencies);
  registerRoleMappingRoute(dependencies);
  registerUserRoute(dependencies);
};

exports.registerRoleMappingsRoutes = registerRoleMappingsRoutes;