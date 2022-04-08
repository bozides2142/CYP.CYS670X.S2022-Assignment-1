"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineRoutes = defineRoutes;

var _common = require("../../common");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function defineRoutes(router, customIntegrationsRegistry) {
  router.get({
    path: _common.ROUTES_APPEND_CUSTOM_INTEGRATIONS,
    validate: false
  }, async (context, request, response) => {
    const integrations = customIntegrationsRegistry.getAppendCustomIntegrations();
    return response.ok({
      body: integrations
    });
  });
  router.get({
    path: _common.ROUTES_REPLACEMENT_CUSTOM_INTEGRATIONS,
    validate: false
  }, async (context, request, response) => {
    const integrations = customIntegrationsRegistry.getReplacementCustomIntegrations();
    return response.ok({
      body: integrations
    });
  });
}