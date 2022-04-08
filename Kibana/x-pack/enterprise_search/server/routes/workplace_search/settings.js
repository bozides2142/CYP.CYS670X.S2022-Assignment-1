"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerOrgSettingsCustomizeRoute = registerOrgSettingsCustomizeRoute;
exports.registerOrgSettingsOauthApplicationRoute = registerOrgSettingsOauthApplicationRoute;
exports.registerOrgSettingsRoute = registerOrgSettingsRoute;
exports.registerOrgSettingsUploadImagesRoute = registerOrgSettingsUploadImagesRoute;
exports.registerSettingsRoutes = void 0;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const MAX_IMAGE_BYTES = 2000000;

function registerOrgSettingsRoute({
  router,
  enterpriseSearchRequestHandler
}) {
  router.get({
    path: '/internal/workplace_search/org/settings',
    validate: false
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/org/settings'
  }));
}

function registerOrgSettingsCustomizeRoute({
  router,
  enterpriseSearchRequestHandler
}) {
  router.put({
    path: '/internal/workplace_search/org/settings/customize',
    validate: {
      body: _configSchema.schema.object({
        name: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/org/settings/customize'
  }));
}

function registerOrgSettingsUploadImagesRoute({
  router,
  enterpriseSearchRequestHandler
}) {
  router.put({
    path: '/internal/workplace_search/org/settings/upload_images',
    validate: {
      body: _configSchema.schema.object({
        logo: _configSchema.schema.maybe(_configSchema.schema.nullable(_configSchema.schema.string())),
        icon: _configSchema.schema.maybe(_configSchema.schema.nullable(_configSchema.schema.string()))
      })
    },
    options: {
      body: {
        maxBytes: MAX_IMAGE_BYTES
      }
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/org/settings/upload_images'
  }));
}

function registerOrgSettingsOauthApplicationRoute({
  router,
  enterpriseSearchRequestHandler
}) {
  router.put({
    path: '/internal/workplace_search/org/settings/oauth_application',
    validate: {
      body: _configSchema.schema.object({
        oauth_application: _configSchema.schema.object({
          name: _configSchema.schema.string(),
          confidential: _configSchema.schema.boolean(),
          redirect_uri: _configSchema.schema.string()
        })
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/org/settings/oauth_application'
  }));
}

const registerSettingsRoutes = dependencies => {
  registerOrgSettingsRoute(dependencies);
  registerOrgSettingsCustomizeRoute(dependencies);
  registerOrgSettingsUploadImagesRoute(dependencies);
  registerOrgSettingsOauthApplicationRoute(dependencies);
};

exports.registerSettingsRoutes = registerSettingsRoutes;