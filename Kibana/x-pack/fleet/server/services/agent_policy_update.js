"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.agentPolicyUpdateEventHandler = agentPolicyUpdateEventHandler;

var _api_keys = require("./api_keys");

var _agents = require("./agents");

var _agent_policy = require("./agent_policy");

var _app_context = require("./app_context");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const fakeRequest = {
  headers: {},
  getBasePath: () => '',
  path: '/',
  route: {
    settings: {}
  },
  url: {
    href: '/'
  },
  raw: {
    req: {
      url: '/'
    }
  }
};

async function agentPolicyUpdateEventHandler(soClient, esClient, action, agentPolicyId) {
  // `soClient` from ingest `appContextService` is used to create policy change actions
  // to ensure encrypted SOs are handled correctly
  const internalSoClient = _app_context.appContextService.getInternalUserSOClient(fakeRequest);

  if (action === 'created') {
    await (0, _api_keys.generateEnrollmentAPIKey)(soClient, esClient, {
      name: 'Default',
      agentPolicyId,
      forceRecreate: true
    });
    await _agent_policy.agentPolicyService.deployPolicy(internalSoClient, agentPolicyId);
  }

  if (action === 'updated') {
    await _agent_policy.agentPolicyService.deployPolicy(internalSoClient, agentPolicyId);
  }

  if (action === 'deleted') {
    await (0, _agents.unenrollForAgentPolicyId)(soClient, esClient, agentPolicyId);
    await (0, _api_keys.deleteEnrollmentApiKeyForAgentPolicyId)(esClient, agentPolicyId);
  }
}