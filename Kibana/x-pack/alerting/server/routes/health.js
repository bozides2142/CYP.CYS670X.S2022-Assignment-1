"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.healthRoute = void 0;

var _lib = require("./lib");

var _types = require("../types");

var _get_security_health = require("../lib/get_security_health");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const rewriteBodyRes = ({
  isSufficientlySecure,
  hasPermanentEncryptionKey,
  alertingFrameworkHealth,
  ...rest
}) => ({ ...rest,
  is_sufficiently_secure: isSufficientlySecure,
  has_permanent_encryption_key: hasPermanentEncryptionKey,
  alerting_framework_health: {
    decryption_health: alertingFrameworkHealth.decryptionHealth,
    execution_health: alertingFrameworkHealth.executionHealth,
    read_health: alertingFrameworkHealth.readHealth
  },
  alerting_framework_heath: {
    // Legacy: pre-v8.0 typo
    _deprecated: 'This state property has a typo, use "alerting_framework_health" instead.',
    decryption_health: alertingFrameworkHealth.decryptionHealth,
    execution_health: alertingFrameworkHealth.executionHealth,
    read_health: alertingFrameworkHealth.readHealth
  }
});

const healthRoute = (router, licenseState, encryptedSavedObjects) => {
  router.get({
    path: `${_types.BASE_ALERTING_API_PATH}/_health`,
    validate: false
  }, router.handleLegacyErrors((0, _lib.verifyAccessAndContext)(licenseState, async function (context, req, res) {
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
          body: rewriteBodyRes(frameworkHealth)
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
  })));
};

exports.healthRoute = healthRoute;