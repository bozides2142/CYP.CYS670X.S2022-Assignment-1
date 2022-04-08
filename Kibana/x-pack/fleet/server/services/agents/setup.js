"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ensureFleetServerAgentPoliciesExists = ensureFleetServerAgentPoliciesExists;

var _constants = require("../../constants");

var _agent_policy = require("../agent_policy");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Ensure a .fleet-policy document exist for each agent policy so Fleet server can retrieve it
 */


async function ensureFleetServerAgentPoliciesExists(soClient, esClient) {
  const {
    items: agentPolicies
  } = await _agent_policy.agentPolicyService.list(soClient, {
    perPage: _constants.SO_SEARCH_LIMIT
  });
  await Promise.all(agentPolicies.map(async agentPolicy => {
    const policyChangeActionExist = !!(await _agent_policy.agentPolicyService.getLatestFleetPolicy(esClient, agentPolicy.id));

    if (!policyChangeActionExist) {
      return _agent_policy.agentPolicyService.deployPolicy(soClient, agentPolicy.id);
    }
  }));
}