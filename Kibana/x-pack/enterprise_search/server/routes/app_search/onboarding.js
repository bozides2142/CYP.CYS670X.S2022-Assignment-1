"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerOnboardingRoutes = registerOnboardingRoutes;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerOnboardingRoutes({
  router,
  enterpriseSearchRequestHandler
}) {
  router.post({
    path: '/internal/app_search/onboarding_complete',
    validate: {
      body: _configSchema.schema.object({
        seed_sample_engine: _configSchema.schema.maybe(_configSchema.schema.boolean())
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/as/onboarding/complete',
    hasJsonResponse: false
  }));
}