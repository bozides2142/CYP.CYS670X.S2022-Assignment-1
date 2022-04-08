"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.migratePackagePolicyToV7140 = exports.migrateInstallationToV7140 = void 0;

var _security_solution = require("./security_solution");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const migratePackagePolicyToV7140 = (packagePolicyDoc, migrationContext) => {
  var _packagePolicyDoc$att;

  let updatedPackagePolicyDoc = packagePolicyDoc; // Endpoint specific migrations

  if (((_packagePolicyDoc$att = packagePolicyDoc.attributes.package) === null || _packagePolicyDoc$att === void 0 ? void 0 : _packagePolicyDoc$att.name) === 'endpoint') {
    updatedPackagePolicyDoc = (0, _security_solution.migrateEndpointPackagePolicyToV7140)(packagePolicyDoc, migrationContext);
  }

  return updatedPackagePolicyDoc;
};

exports.migratePackagePolicyToV7140 = migratePackagePolicyToV7140;

const migrateInstallationToV7140 = doc => {
  // Fix a missing migration for user that used Fleet before 7.9
  if (!doc.attributes.install_source) {
    doc.attributes.install_source = 'registry';
  }

  if (!doc.attributes.install_version) {
    doc.attributes.install_version = doc.attributes.version;
  }

  return doc;
};

exports.migrateInstallationToV7140 = migrateInstallationToV7140;