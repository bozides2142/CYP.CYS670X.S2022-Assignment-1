"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reassignAgent = reassignAgent;
exports.reassignAgentIsAllowed = reassignAgentIsAllowed;
exports.reassignAgents = reassignAgents;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _agent_policy = require("../agent_policy");

var _errors = require("../../errors");

var _crud = require("./crud");

var _actions = require("./actions");

var _helpers = require("./helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function reassignAgent(soClient, esClient, agentId, newAgentPolicyId) {
  const newAgentPolicy = await _agent_policy.agentPolicyService.get(soClient, newAgentPolicyId);

  if (!newAgentPolicy) {
    throw _boom.default.notFound(`Agent policy not found: ${newAgentPolicyId}`);
  }

  await reassignAgentIsAllowed(soClient, esClient, agentId, newAgentPolicyId);
  await (0, _crud.updateAgent)(esClient, agentId, {
    policy_id: newAgentPolicyId,
    policy_revision: null
  });
  await (0, _actions.createAgentAction)(esClient, {
    agent_id: agentId,
    created_at: new Date().toISOString(),
    type: 'POLICY_REASSIGN'
  });
}

async function reassignAgentIsAllowed(soClient, esClient, agentId, newAgentPolicyId) {
  const agentPolicy = await (0, _crud.getAgentPolicyForAgent)(soClient, esClient, agentId);

  if (agentPolicy !== null && agentPolicy !== void 0 && agentPolicy.is_managed) {
    throw new _errors.HostedAgentPolicyRestrictionRelatedError(`Cannot reassign an agent from hosted agent policy ${agentPolicy.id}`);
  }

  const newAgentPolicy = await _agent_policy.agentPolicyService.get(soClient, newAgentPolicyId);

  if (newAgentPolicy !== null && newAgentPolicy !== void 0 && newAgentPolicy.is_managed) {
    throw new _errors.HostedAgentPolicyRestrictionRelatedError(`Cannot reassign an agent to hosted agent policy ${newAgentPolicy.id}`);
  }

  return true;
}

function isMgetDoc(doc) {
  return Boolean(doc && 'found' in doc);
}

async function reassignAgents(soClient, esClient, options, newAgentPolicyId) {
  const agentPolicy = await _agent_policy.agentPolicyService.get(soClient, newAgentPolicyId);

  if (!agentPolicy) {
    throw _boom.default.notFound(`Agent policy not found: ${newAgentPolicyId}`);
  }

  const outgoingErrors = {};
  let givenAgents = [];

  if ('agents' in options) {
    givenAgents = options.agents;
  } else if ('agentIds' in options) {
    const givenAgentsResults = await (0, _crud.getAgentDocuments)(esClient, options.agentIds);

    for (const agentResult of givenAgentsResults) {
      if (isMgetDoc(agentResult) && agentResult.found === false) {
        outgoingErrors[agentResult._id] = new _errors.AgentReassignmentError(`Cannot find agent ${agentResult._id}`);
      } else {
        givenAgents.push((0, _helpers.searchHitToAgent)(agentResult));
      }
    }
  } else if ('kuery' in options) {
    givenAgents = await (0, _crud.getAgents)(esClient, options);
  }

  const givenOrder = 'agentIds' in options ? options.agentIds : givenAgents.map(agent => agent.id); // which are allowed to unenroll

  const agentResults = await Promise.allSettled(givenAgents.map(async (agent, index) => {
    if (agent.policy_id === newAgentPolicyId) {
      throw new _errors.AgentReassignmentError(`${agent.id} is already assigned to ${newAgentPolicyId}`);
    }

    const isAllowed = await reassignAgentIsAllowed(soClient, esClient, agent.id, newAgentPolicyId);

    if (isAllowed) {
      return agent;
    }

    throw new _errors.AgentReassignmentError(`${agent.id} may not be reassigned to ${newAgentPolicyId}`);
  })); // Filter to agents that do not already use the new agent policy ID

  const agentsToUpdate = agentResults.reduce((agents, result, index) => {
    if (result.status === 'fulfilled') {
      agents.push(result.value);
    } else {
      const id = givenAgents[index].id;
      outgoingErrors[id] = result.reason;
    }

    return agents;
  }, []);
  await (0, _crud.bulkUpdateAgents)(esClient, agentsToUpdate.map(agent => ({
    agentId: agent.id,
    data: {
      policy_id: newAgentPolicyId,
      policy_revision: null
    }
  })));
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
  const now = new Date().toISOString();
  await (0, _actions.bulkCreateAgentActions)(esClient, agentsToUpdate.map(agent => ({
    agent_id: agent.id,
    created_at: now,
    type: 'POLICY_REASSIGN'
  })));
  return {
    items: orderedOut
  };
}