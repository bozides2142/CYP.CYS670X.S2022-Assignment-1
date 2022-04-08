"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerRoutes = void 0;

var _constants = require("../../constants");

var _types = require("../../types");

var _handlers = require("./handlers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const registerRoutes = router => {
  // List
  router.get({
    path: _constants.PACKAGE_POLICY_API_ROUTES.LIST_PATTERN,
    validate: _types.GetPackagePoliciesRequestSchema,
    fleetAuthz: {
      integrations: {
        readIntegrationPolicies: true
      }
    }
  }, _handlers.getPackagePoliciesHandler); // Get one

  router.get({
    path: _constants.PACKAGE_POLICY_API_ROUTES.INFO_PATTERN,
    validate: _types.GetOnePackagePolicyRequestSchema,
    fleetAuthz: {
      integrations: {
        readIntegrationPolicies: true
      }
    }
  }, _handlers.getOnePackagePolicyHandler); // Create

  router.post({
    path: _constants.PACKAGE_POLICY_API_ROUTES.CREATE_PATTERN,
    validate: _types.CreatePackagePolicyRequestSchema,
    fleetAuthz: {
      integrations: {
        writeIntegrationPolicies: true
      }
    }
  }, _handlers.createPackagePolicyHandler); // Update

  router.put({
    path: _constants.PACKAGE_POLICY_API_ROUTES.UPDATE_PATTERN,
    validate: _types.UpdatePackagePolicyRequestSchema,
    fleetAuthz: {
      integrations: {
        writeIntegrationPolicies: true
      }
    }
  }, _handlers.updatePackagePolicyHandler); // Delete

  router.post({
    path: _constants.PACKAGE_POLICY_API_ROUTES.DELETE_PATTERN,
    validate: _types.DeletePackagePoliciesRequestSchema,
    fleetAuthz: {
      integrations: {
        writeIntegrationPolicies: true
      }
    }
  }, _handlers.deletePackagePolicyHandler); // Upgrade

  router.post({
    path: _constants.PACKAGE_POLICY_API_ROUTES.UPGRADE_PATTERN,
    validate: _types.UpgradePackagePoliciesRequestSchema,
    fleetAuthz: {
      integrations: {
        writeIntegrationPolicies: true
      }
    }
  }, _handlers.upgradePackagePolicyHandler); // Upgrade - DryRun

  router.post({
    path: _constants.PACKAGE_POLICY_API_ROUTES.DRYRUN_PATTERN,
    validate: _types.DryRunPackagePoliciesRequestSchema,
    fleetAuthz: {
      integrations: {
        readIntegrationPolicies: true
      }
    }
  }, _handlers.dryRunUpgradePackagePolicyHandler);
};

exports.registerRoutes = registerRoutes;