"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.syncAgentConfigsToApmPackagePolicies = syncAgentConfigsToApmPackagePolicies;

var _get_internal_saved_objects_client = require("../../lib/helpers/get_internal_saved_objects_client");

var _list_configurations = require("../settings/agent_configuration/list_configurations");

var _get_apm_package_policies = require("./get_apm_package_policies");

var _register_fleet_policy_callbacks = require("./register_fleet_policy_callbacks");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function syncAgentConfigsToApmPackagePolicies({
  core,
  fleetPluginStart,
  setup,
  telemetryUsageCounter
}) {
  if (telemetryUsageCounter) {
    telemetryUsageCounter.incrementCounter({
      counterName: 'sync_agent_config_to_apm_package_policies',
      counterType: 'success'
    });
  }

  const coreStart = await core.start();
  const esClient = coreStart.elasticsearch.client.asInternalUser;
  const [savedObjectsClient, agentConfigurations, packagePolicies] = await Promise.all([(0, _get_internal_saved_objects_client.getInternalSavedObjectsClient)(core.setup), (0, _list_configurations.listConfigurations)({
    setup
  }), (0, _get_apm_package_policies.getApmPackgePolicies)({
    core,
    fleetPluginStart
  })]);
  return Promise.all(packagePolicies.items.map(async item => {
    const {
      id,
      revision,
      updated_at,
      updated_by,
      ...packagePolicy
    } = item; // eslint-disable-line @typescript-eslint/naming-convention

    const updatedPackagePolicy = (0, _register_fleet_policy_callbacks.getPackagePolicyWithAgentConfigurations)(packagePolicy, agentConfigurations);
    return fleetPluginStart.packagePolicyService.update(savedObjectsClient, esClient, id, updatedPackagePolicy);
  }));
}