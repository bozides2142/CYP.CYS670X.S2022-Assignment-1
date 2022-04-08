"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.migratePackagePolicyToV7160 = exports.migrateInstallationToV7160 = void 0;

var _common = require("../../../common");

var _constants = require("../../constants");

var _security_solution = require("./security_solution");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const migrateInstallationToV7160 = (installationDoc, migrationContext) => {
  const updatedInstallationDoc = installationDoc;
  const DEFAULT_PACKAGES = [_common.FLEET_SYSTEM_PACKAGE, _common.FLEET_ELASTIC_AGENT_PACKAGE, _common.FLEET_SERVER_PACKAGE].map(name => ({
    name,
    version: _constants.PRECONFIGURATION_LATEST_KEYWORD
  }));

  if (DEFAULT_PACKAGES.some(pkg => pkg.name === updatedInstallationDoc.attributes.name)) {
    updatedInstallationDoc.attributes.keep_policies_up_to_date = true;
  }

  return updatedInstallationDoc;
};

exports.migrateInstallationToV7160 = migrateInstallationToV7160;

const migratePackagePolicyToV7160 = (packagePolicyDoc, migrationContext) => {
  var _packagePolicyDoc$att;

  let updatedPackagePolicyDoc = packagePolicyDoc; // Endpoint specific migrations

  if (((_packagePolicyDoc$att = packagePolicyDoc.attributes.package) === null || _packagePolicyDoc$att === void 0 ? void 0 : _packagePolicyDoc$att.name) === 'endpoint') {
    updatedPackagePolicyDoc = (0, _security_solution.migratePackagePolicyToV7160)(packagePolicyDoc, migrationContext);
  }

  return updatedPackagePolicyDoc;
};

exports.migratePackagePolicyToV7160 = migratePackagePolicyToV7160;