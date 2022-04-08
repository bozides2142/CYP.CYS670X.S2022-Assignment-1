"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isPackageLimited = exports.doesAgentPolicyAlreadyIncludePackage = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const isPackageLimited = packageInfo => {
  return (packageInfo.policy_templates || []).some(policyTemplate => policyTemplate.multiple === false);
};

exports.isPackageLimited = isPackageLimited;

const doesAgentPolicyAlreadyIncludePackage = (agentPolicy, packageName) => {
  if (agentPolicy.package_policies.length && typeof agentPolicy.package_policies[0] === 'string') {
    throw new Error('Unable to read full package policy information');
  }

  return agentPolicy.package_policies.map(packagePolicy => {
    var _packagePolicy$packag;

    return ((_packagePolicy$packag = packagePolicy.package) === null || _packagePolicy$packag === void 0 ? void 0 : _packagePolicy$packag.name) || '';
  }).includes(packageName);
};

exports.doesAgentPolicyAlreadyIncludePackage = doesAgentPolicyAlreadyIncludePackage;