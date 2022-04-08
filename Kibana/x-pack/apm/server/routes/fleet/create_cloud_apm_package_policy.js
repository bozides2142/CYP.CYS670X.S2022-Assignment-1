"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createCloudApmPackgePolicy = createCloudApmPackgePolicy;

var _apm_saved_object_constants = require("../../../common/apm_saved_object_constants");

var _get_apm_package_policy_definition = require("./get_apm_package_policy_definition");

var _merge_package_policy_with_apm = require("./merge_package_policy_with_apm");

var _fleet = require("../../../common/fleet");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function createCloudApmPackgePolicy({
  cloudPluginSetup,
  fleetPluginStart,
  savedObjectsClient,
  esClient,
  logger,
  setup,
  kibanaVersion
}) {
  const {
    attributes
  } = await savedObjectsClient.get(_apm_saved_object_constants.APM_SERVER_SCHEMA_SAVED_OBJECT_TYPE, _apm_saved_object_constants.APM_SERVER_SCHEMA_SAVED_OBJECT_ID);
  const apmServerSchema = JSON.parse(attributes.schemaJson); // Merges agent config and source maps with the new APM cloud package policy

  const apmPackagePolicyDefinition = await (0, _get_apm_package_policy_definition.getApmPackagePolicyDefinition)({
    apmServerSchema,
    cloudPluginSetup,
    fleetPluginStart,
    kibanaVersion
  });
  const mergedAPMPackagePolicy = await (0, _merge_package_policy_with_apm.mergePackagePolicyWithApm)({
    setup,
    packagePolicy: apmPackagePolicyDefinition,
    fleetPluginStart
  });
  logger.info(`Fleet migration on Cloud - apmPackagePolicy create start`);
  const apmPackagePolicy = await fleetPluginStart.packagePolicyService.create(savedObjectsClient, esClient, mergedAPMPackagePolicy, {
    id: _fleet.ELASTIC_CLOUD_APM_AGENT_POLICY_ID,
    force: true,
    bumpRevision: true
  });
  logger.info(`Fleet migration on Cloud - apmPackagePolicy create end`);
  return apmPackagePolicy;
}