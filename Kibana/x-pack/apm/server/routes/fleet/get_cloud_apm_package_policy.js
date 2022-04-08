"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.APM_PACKAGE_NAME = void 0;
exports.getApmPackagePolicy = getApmPackagePolicy;
exports.getCloudAgentPolicy = getCloudAgentPolicy;

var _fleet = require("../../../common/fleet");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const APM_PACKAGE_NAME = 'apm';
exports.APM_PACKAGE_NAME = APM_PACKAGE_NAME;

async function getCloudAgentPolicy({
  fleetPluginStart,
  savedObjectsClient
}) {
  try {
    return await fleetPluginStart.agentPolicyService.get(savedObjectsClient, _fleet.POLICY_ELASTIC_AGENT_ON_CLOUD);
  } catch (error) {
    if ((error === null || error === void 0 ? void 0 : error.output.statusCode) === 404) {
      return;
    }

    throw error;
  }
}

function getApmPackagePolicy(agentPolicy) {
  if (!agentPolicy) {
    return;
  }

  const packagePolicies = agentPolicy.package_policies;
  return packagePolicies.find(packagePolicy => {
    var _packagePolicy$packag;

    return (packagePolicy === null || packagePolicy === void 0 ? void 0 : (_packagePolicy$packag = packagePolicy.package) === null || _packagePolicy$packag === void 0 ? void 0 : _packagePolicy$packag.name) === APM_PACKAGE_NAME;
  });
}