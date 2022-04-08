"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.migrateSettingsToV7100 = exports.migratePackagePolicyToV7100 = exports.migrateAgentPolicyToV7100 = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const migrateAgentPolicyToV7100 = agentPolicyDoc => {
  agentPolicyDoc.attributes.package_policies = agentPolicyDoc.attributes.package_configs; // @ts-expect-error

  delete agentPolicyDoc.attributes.package_configs;
  return agentPolicyDoc;
};

exports.migrateAgentPolicyToV7100 = migrateAgentPolicyToV7100;

const migratePackagePolicyToV7100 = packagePolicyDoc => {
  packagePolicyDoc.attributes.policy_id = packagePolicyDoc.attributes.config_id; // @ts-expect-error

  delete packagePolicyDoc.attributes.config_id;
  return packagePolicyDoc;
};

exports.migratePackagePolicyToV7100 = migratePackagePolicyToV7100;

const migrateSettingsToV7100 = settingsDoc => {
  // @ts-expect-error
  settingsDoc.attributes.kibana_urls = [settingsDoc.attributes.kibana_url]; // @ts-expect-error

  delete settingsDoc.attributes.kibana_url;
  return settingsDoc;
};

exports.migrateSettingsToV7100 = migrateSettingsToV7100;