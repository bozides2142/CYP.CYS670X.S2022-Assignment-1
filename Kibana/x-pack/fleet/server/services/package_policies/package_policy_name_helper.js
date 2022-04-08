"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.incrementPackageName = incrementPackageName;
exports.incrementPackagePolicyCopyName = incrementPackagePolicyCopyName;

var _common = require("../../../common");

var _constants = require("../../constants");

var _package_policy = require("../package_policy");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function incrementPackageName(soClient, packageName) {
  // Fetch all packagePolicies having the package name
  const packagePolicyData = await _package_policy.packagePolicyService.list(soClient, {
    perPage: _common.SO_SEARCH_LIMIT,
    kuery: `${_constants.PACKAGE_POLICY_SAVED_OBJECT_TYPE}.package.name: "${packageName}"`
  });
  return (0, _common.getMaxPackageName)(packageName, packagePolicyData === null || packagePolicyData === void 0 ? void 0 : packagePolicyData.items);
}

async function incrementPackagePolicyCopyName(soClient, packagePolicyName) {
  let packageName = packagePolicyName;
  const packageNameMatches = packagePolicyName.match(/^(.*)\s\(copy\s?[0-9]*\)$/);

  if (packageNameMatches) {
    packageName = packageNameMatches[1];
  } // find all pacakge policies starting with the same name and increment the name


  const packagePolicyData = await _package_policy.packagePolicyService.list(soClient, {
    perPage: _common.SO_SEARCH_LIMIT,
    kuery: `${_constants.PACKAGE_POLICY_SAVED_OBJECT_TYPE}.name: ${packageName}*`
  });
  const maxVersion = packagePolicyData.items.length > 0 ? Math.max(...packagePolicyData.items.map(item => {
    const matches = item.name.match(/^(.*)\s\(copy\s?([0-9]*)\)$/);

    if (matches) {
      return parseInt(matches[2], 10) || 1;
    }

    return 0;
  })) : 0;
  const copyVersion = maxVersion + 1;

  if (copyVersion === 1) {
    return `${packageName} (copy)`;
  }

  return `${packageName} (copy ${copyVersion})`;
}