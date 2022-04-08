"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.migratePackagePolicyToV7150 = void 0;

var _security_solution = require("./security_solution");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const migratePackagePolicyToV7150 = (packagePolicyDoc, migrationContext) => {
  var _packagePolicyDoc$att;

  let updatedPackagePolicyDoc = packagePolicyDoc; // Endpoint specific migrations

  if (((_packagePolicyDoc$att = packagePolicyDoc.attributes.package) === null || _packagePolicyDoc$att === void 0 ? void 0 : _packagePolicyDoc$att.name) === 'endpoint') {
    updatedPackagePolicyDoc = (0, _security_solution.migratePackagePolicyToV7150)(packagePolicyDoc, migrationContext);
  }

  return updatedPackagePolicyDoc;
};

exports.migratePackagePolicyToV7150 = migratePackagePolicyToV7150;