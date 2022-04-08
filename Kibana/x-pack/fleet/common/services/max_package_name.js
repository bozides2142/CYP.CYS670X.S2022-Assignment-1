"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMaxPackageName = getMaxPackageName;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function getMaxPackageName(packageName, packagePolicies) {
  // Retrieve highest number appended to package policy name and increment it by one
  const pkgPoliciesNamePattern = new RegExp(`${packageName}-(\\d+)`);
  const maxPkgPolicyName = Math.max(...(packagePolicies !== null && packagePolicies !== void 0 ? packagePolicies : []).filter(ds => Boolean(ds.name.match(pkgPoliciesNamePattern))).map(ds => parseInt(ds.name.match(pkgPoliciesNamePattern)[1], 10)), 0);
  return `${packageName}-${maxPkgPolicyName + 1}`;
}