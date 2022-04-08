"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerOrgEnableRoleMappingsRoute = registerOrgEnableRoleMappingsRoute;
exports.registerOrgRoleMappingRoute = registerOrgRoleMappingRoute;
exports.registerOrgRoleMappingsRoute = registerOrgRoleMappingsRoute;
exports.registerOrgUserRoute = registerOrgUserRoute;
exports.registerRoleMappingsRoutes = void 0;

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
  groups: _configSchema.schema.arrayOf(_configSchema.schema.string()),
  allGroups: _configSchema.schema.boolean()
};

function registerOrgEnableRoleMappingsRoute({
  router,
  enterpriseSearchRequestHandler
}) {
  router.post({
    path: '/internal/workplace_search/org/role_mappings/enable_role_based_access',
    validate: false
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/org/role_mappings/enable_role_based_access'
  }));
}

function registerOrgRoleMappingsRoute({
  router,
  enterpriseSearchRequestHandler
}) {
  router.get({
    path: '/internal/workplace_search/org/role_mappings',
    validate: false
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/org/role_mappings/collection'
  }));
  router.post({
    path: '/internal/workplace_search/org/role_mappings',
    validate: {
      body: _configSchema.schema.object(roleMappingBaseSchema)
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/org/role_mappings/collection'
  }));
}

function registerOrgRoleMappingRoute({
  router,
  enterpriseSearchRequestHandler
}) {
  router.put({
    path: '/internal/workplace_search/org/role_mappings/{id}',
    validate: {
      body: _configSchema.schema.object(roleMappingBaseSchema),
      params: _configSchema.schema.object({
        id: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/org/role_mappings/:id'
  }));
  router.delete({
    path: '/internal/workplace_search/org/role_mappings/{id}',
    validate: {
      params: _configSchema.schema.object({
        id: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/org/role_mappings/:id'
  }));
}

function registerOrgUserRoute({
  router,
  enterpriseSearchRequestHandler
}) {
  router.post({
    path: '/internal/workplace_search/org/single_user_role_mapping',
    validate: {
      body: _configSchema.schema.object({
        roleMapping: _configSchema.schema.object({
          groups: _configSchema.schema.arrayOf(_configSchema.schema.string()),
          roleType: _configSchema.schema.string(),
          allGroups: _configSchema.schema.boolean(),
          id: _configSchema.schema.maybe(_configSchema.schema.string())
        }),
        elasticsearchUser: _configSchema.schema.object({
          username: _configSchema.schema.string(),
          email: _configSchema.schema.string()
        })
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/org/role_mappings/upsert_single_user_role_mapping'
  }));
}

const registerRoleMappingsRoutes = dependencies => {
  registerOrgEnableRoleMappingsRoute(dependencies);
  registerOrgRoleMappingsRoute(dependencies);
  registerOrgRoleMappingRoute(dependencies);
  registerOrgUserRoute(dependencies);
};

exports.registerRoleMappingsRoutes = registerRoleMappingsRoutes;