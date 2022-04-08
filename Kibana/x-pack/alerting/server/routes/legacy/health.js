"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.healthRoute = healthRoute;

var _license_api_access = require("../../lib/license_api_access");

var _track_legacy_route_usage = require("../../lib/track_legacy_route_usage");

var _get_security_health = require("../../lib/get_security_health");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function healthRoute(router, licenseState, encryptedSavedObjects, usageCounter) {
  router.get({
    path: '/api/alerts/_health',
    validate: false
  }, router.handleLegacyErrors(async function (context, req, res) {
    (0, _license_api_access.verifyApiAccess)(licenseState);

    if (!context.alerting) {
      return res.badRequest({
        body: 'RouteHandlerContext is not registered for alerting'
      });
    }

    (0, _track_legacy_route_usage.trackLegacyRouteUsage)('health', usageCounter);

    try {
      // Verify that user has access to at least one rule type
      const ruleTypes = Array.from(await context.alerting.getRulesClient().listAlertTypes());

      if (ruleTypes.length > 0) {
        const alertingFrameworkHealth = await context.alerting.getFrameworkHealth();
        const securityHealth = await (0, _get_security_health.getSecurityHealth)(async () => licenseState ? licenseState.getIsSecurityEnabled() : null, async () => encryptedSavedObjects.canEncrypt, context.alerting.areApiKeysEnabled);
        const frameworkHealth = { ...securityHealth,
          alertingFrameworkHealth
        };
        return res.ok({
          body: { ...frameworkHealth,
            alertingFrameworkHeath: { // Legacy: pre-v8.0 typo
              ...alertingFrameworkHealth,
              _deprecated: 'This state property has a typo, use "alertingFrameworkHealth" instead.'
            }
          }
        });
      } else {
        return res.forbidden({
          body: {
            message: `Unauthorized to access alerting framework health`
          }
        });
      }
    } catch (error) {
      return res.badRequest({
        body: error
      });
    }
  }));
}