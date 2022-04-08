"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.migrateOutputToV800 = exports.migrateInstallationToV800 = void 0;

var _common = require("../../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const migrateOutputToV800 = (outputDoc, migrationContext) => {
  if (outputDoc.attributes.is_default) {
    outputDoc.attributes.is_default_monitoring = true;
  }

  return outputDoc;
};

exports.migrateOutputToV800 = migrateOutputToV800;

const migrateInstallationToV800 = (installationDoc, migrationContext) => {
  const updatedInstallationDoc = installationDoc;

  const shouldKeepPoliciesUpToDate = _common.AUTO_UPGRADE_POLICIES_PACKAGES.some(pkg => pkg.name === updatedInstallationDoc.attributes.name);

  if (shouldKeepPoliciesUpToDate) {
    updatedInstallationDoc.attributes.keep_policies_up_to_date = true;
  }

  return updatedInstallationDoc;
};

exports.migrateInstallationToV800 = migrateInstallationToV800;