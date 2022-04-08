"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAgentPolicyWithPackages = createAgentPolicyWithPackages;

var _common = require("../../common");

var _ = require(".");

var _package_policies = require("./package_policies");

var _packages = require("./epm/packages");

var _setup = require("./setup");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const FLEET_SERVER_POLICY_ID = 'fleet-server-policy';

async function getFleetServerAgentPolicyId(soClient) {
  let agentPolicyId; // creating first fleet server policy with id 'fleet-server-policy'

  let agentPolicy;

  try {
    agentPolicy = await _.agentPolicyService.get(soClient, FLEET_SERVER_POLICY_ID, false);
  } catch (err) {
    if (!err.isBoom || err.output.statusCode !== 404) {
      throw err;
    }
  }

  if (!agentPolicy) {
    agentPolicyId = FLEET_SERVER_POLICY_ID;
  }

  return agentPolicyId;
}

async function createPackagePolicy(soClient, esClient, agentPolicy, packageToInstall, options) {
  const newPackagePolicy = await _.packagePolicyService.buildPackagePolicyFromPackage(soClient, packageToInstall).catch(async error => {
    // rollback agent policy on error
    await _.agentPolicyService.delete(soClient, esClient, agentPolicy.id, {
      force: true
    });
    throw error;
  });
  if (!newPackagePolicy) return;
  newPackagePolicy.policy_id = agentPolicy.id;
  newPackagePolicy.namespace = agentPolicy.namespace;
  newPackagePolicy.name = await (0, _package_policies.incrementPackageName)(soClient, packageToInstall);
  await _.packagePolicyService.create(soClient, esClient, newPackagePolicy, {
    spaceId: options.spaceId,
    user: options.user,
    bumpRevision: false
  });
}

async function createAgentPolicyWithPackages({
  soClient,
  esClient,
  newPolicy,
  hasFleetServer,
  withSysMonitoring,
  monitoringEnabled,
  spaceId,
  user
}) {
  let agentPolicyId = newPolicy.id;
  const packagesToInstall = [];

  if (hasFleetServer) {
    packagesToInstall.push(_common.FLEET_SERVER_PACKAGE);
    agentPolicyId = agentPolicyId || (await getFleetServerAgentPolicyId(soClient));

    if (agentPolicyId === FLEET_SERVER_POLICY_ID) {
      // setting first fleet server policy to default, so that fleet server can enroll without setting policy_id
      newPolicy.is_default_fleet_server = true;
    }
  }

  if (withSysMonitoring) {
    packagesToInstall.push(_common.FLEET_SYSTEM_PACKAGE);
  }

  if (monitoringEnabled !== null && monitoringEnabled !== void 0 && monitoringEnabled.length) {
    packagesToInstall.push(_common.FLEET_ELASTIC_AGENT_PACKAGE);
  }

  if (packagesToInstall.length > 0) {
    await (0, _packages.bulkInstallPackages)({
      savedObjectsClient: soClient,
      esClient,
      packagesToInstall,
      spaceId
    });
  }

  const {
    id,
    ...policy
  } = newPolicy; // omit id from create object

  const agentPolicy = await _.agentPolicyService.create(soClient, esClient, policy, {
    user,
    id: agentPolicyId
  }); // Create the fleet server package policy and add it to agent policy.

  if (hasFleetServer) {
    await createPackagePolicy(soClient, esClient, agentPolicy, _common.FLEET_SERVER_PACKAGE, {
      spaceId,
      user
    });
  } // Create the system monitoring package policy and add it to agent policy.


  if (withSysMonitoring) {
    await createPackagePolicy(soClient, esClient, agentPolicy, _common.FLEET_SYSTEM_PACKAGE, {
      spaceId,
      user
    });
  }

  await (0, _setup.ensureDefaultEnrollmentAPIKeysExists)(soClient, esClient);
  await _.agentPolicyService.deployPolicy(soClient, agentPolicy.id);
  return agentPolicy;
}