"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.migrateSettingsToV7130 = exports.migratePackagePolicyToV7130 = exports.migrateOutputToV7130 = void 0;

var _security_solution = require("./security_solution");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const migrateSettingsToV7130 = settingsDoc => {
  // @ts-expect-error
  delete settingsDoc.attributes.package_auto_upgrade; // @ts-expect-error

  delete settingsDoc.attributes.agent_auto_upgrade; // @ts-expect-error

  delete settingsDoc.attributes.kibana_urls; // @ts-expect-error

  delete settingsDoc.attributes.kibana_ca_sha256;
  return settingsDoc;
};

exports.migrateSettingsToV7130 = migrateSettingsToV7130;

const migrateOutputToV7130 = outputDoc => {
  // @ts-expect-error
  delete outputDoc.attributes.fleet_enroll_password; // @ts-expect-error

  delete outputDoc.attributes.fleet_enroll_username;
  return outputDoc;
};

exports.migrateOutputToV7130 = migrateOutputToV7130;

const migratePackagePolicyToV7130 = (packagePolicyDoc, migrationContext) => {
  var _packagePolicyDoc$att;

  let updatedPackagePolicyDoc = packagePolicyDoc; // Endpoint specific migrations

  if (((_packagePolicyDoc$att = packagePolicyDoc.attributes.package) === null || _packagePolicyDoc$att === void 0 ? void 0 : _packagePolicyDoc$att.name) === 'endpoint') {
    updatedPackagePolicyDoc = (0, _security_solution.migrateEndpointPackagePolicyToV7130)(packagePolicyDoc, migrationContext);
  }

  return updatedPackagePolicyDoc;
};

exports.migratePackagePolicyToV7130 = migratePackagePolicyToV7130;