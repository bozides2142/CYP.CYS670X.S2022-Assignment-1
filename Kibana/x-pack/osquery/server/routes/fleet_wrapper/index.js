"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initFleetWrapperRoutes = void 0;

var _get_agent_policies = require("./get_agent_policies");

var _get_agent_policy = require("./get_agent_policy");

var _get_agent_status_for_agent_policy = require("./get_agent_status_for_agent_policy");

var _get_package_policies = require("./get_package_policies");

var _get_agents = require("./get_agents");

var _get_agent_details = require("./get_agent_details");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const initFleetWrapperRoutes = (router, context) => {
  (0, _get_agent_details.getAgentDetailsRoute)(router, context);
  (0, _get_agent_policies.getAgentPoliciesRoute)(router, context);
  (0, _get_agent_policy.getAgentPolicyRoute)(router, context);
  (0, _get_agent_status_for_agent_policy.getAgentStatusForAgentPolicyRoute)(router, context);
  (0, _get_package_policies.getPackagePoliciesRoute)(router, context);
  (0, _get_agents.getAgentsRoute)(router, context);
};

exports.initFleetWrapperRoutes = initFleetWrapperRoutes;