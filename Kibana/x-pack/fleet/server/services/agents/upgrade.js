"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendUpgradeAgentAction = sendUpgradeAgentAction;
exports.sendUpgradeAgentsActions = sendUpgradeAgentsActions;

var _services = require("../../services");

var _errors = require("../../errors");

var _services2 = require("../../../common/services");

var _app_context = require("../app_context");

var _actions = require("./actions");

var _crud = require("./crud");

var _helpers = require("./helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function isMgetDoc(doc) {
  return Boolean(doc && 'found' in doc);
}

async function sendUpgradeAgentAction({
  soClient,
  esClient,
  agentId,
  version,
  sourceUri
}) {
  const now = new Date().toISOString();
  const data = {
    version,
    source_uri: sourceUri
  };
  const agentPolicy = await (0, _crud.getAgentPolicyForAgent)(soClient, esClient, agentId);

  if (agentPolicy !== null && agentPolicy !== void 0 && agentPolicy.is_managed) {
    throw new _errors.HostedAgentPolicyRestrictionRelatedError(`Cannot upgrade agent ${agentId} in hosted agent policy ${agentPolicy.id}`);
  }

  await (0, _actions.createAgentAction)(esClient, {
    agent_id: agentId,
    created_at: now,
    data,
    ack_data: data,
    type: 'UPGRADE'
  });
  await (0, _crud.updateAgent)(esClient, agentId, {
    upgraded_at: null,
    upgrade_started_at: now
  });
}

async function sendUpgradeAgentsActions(soClient, esClient, options) {
  // Full set of agents
  const outgoingErrors = {};
  let givenAgents = [];

  if ('agents' in options) {
    givenAgents = options.agents;
  } else if ('agentIds' in options) {
    const givenAgentsResults = await (0, _crud.getAgentDocuments)(esClient, options.agentIds);

    for (const agentResult of givenAgentsResults) {
      if (!isMgetDoc(agentResult) || agentResult.found === false) {
        outgoingErrors[agentResult._id] = new _errors.AgentReassignmentError(`Cannot find agent ${agentResult._id}`);
      } else {
        givenAgents.push((0, _helpers.searchHitToAgent)(agentResult));
      }
    }
  } else if ('kuery' in options) {
    givenAgents = await (0, _crud.getAgents)(esClient, options);
  } // get any policy ids from upgradable agents


  const policyIdsToGet = new Set(givenAgents.filter(agent => agent.policy_id).map(agent => agent.policy_id)); // get the agent policies for those ids

  const agentPolicies = await _services.agentPolicyService.getByIDs(soClient, Array.from(policyIdsToGet), {
    fields: ['is_managed']
  });
  const hostedPolicies = agentPolicies.reduce((acc, policy) => {
    acc[policy.id] = policy.is_managed;
    return acc;
  }, {});

  const isHostedAgent = agent => agent.policy_id && hostedPolicies[agent.policy_id]; // results from getAgents with options.kuery '' (or even 'active:false') may include hosted agents
  // filter them out unless options.force


  const agentsToCheckUpgradeable = 'kuery' in options && !options.force ? givenAgents.filter(agent => !isHostedAgent(agent)) : givenAgents;

  const kibanaVersion = _app_context.appContextService.getKibanaVersion();

  const upgradeableResults = await Promise.allSettled(agentsToCheckUpgradeable.map(async agent => {
    // Filter out agents currently unenrolling, unenrolled, or not upgradeable b/c of version check
    const isAllowed = options.force || (0, _services2.isAgentUpgradeable)(agent, kibanaVersion);

    if (!isAllowed) {
      throw new _errors.IngestManagerError(`${agent.id} is not upgradeable`);
    }

    if (!options.force && isHostedAgent(agent)) {
      throw new _errors.HostedAgentPolicyRestrictionRelatedError(`Cannot upgrade agent in hosted agent policy ${agent.policy_id}`);
    }

    return agent;
  })); // Filter & record errors from results

  const agentsToUpdate = upgradeableResults.reduce((agents, result, index) => {
    if (result.status === 'fulfilled') {
      agents.push(result.value);
    } else {
      const id = givenAgents[index].id;
      outgoingErrors[id] = result.reason;
    }

    return agents;
  }, []); // Create upgrade action for each agent

  const now = new Date().toISOString();
  const data = {
    version: options.version,
    source_uri: options.sourceUri
  };
  await (0, _actions.bulkCreateAgentActions)(esClient, agentsToUpdate.map(agent => ({
    agent_id: agent.id,
    created_at: now,
    data,
    ack_data: data,
    type: 'UPGRADE'
  })));
  await (0, _crud.bulkUpdateAgents)(esClient, agentsToUpdate.map(agent => ({
    agentId: agent.id,
    data: {
      upgraded_at: null,
      upgrade_started_at: now
    }
  })));
  const givenOrder = 'agentIds' in options ? options.agentIds : agentsToCheckUpgradeable.map(agent => agent.id);
  const orderedOut = givenOrder.map(agentId => {
    const hasError = (agentId in outgoingErrors);
    const result = {
      id: agentId,
      success: !hasError
    };

    if (hasError) {
      result.error = outgoingErrors[agentId];
    }

    return result;
  });
  return {
    items: orderedOut
  };
}