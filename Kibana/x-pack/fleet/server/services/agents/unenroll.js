"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.forceUnenrollAgent = forceUnenrollAgent;
exports.invalidateAPIKeysForAgents = invalidateAPIKeysForAgents;
exports.unenrollAgent = unenrollAgent;
exports.unenrollAgents = unenrollAgents;

var APIKeyService = _interopRequireWildcard(require("../api_keys"));

var _errors = require("../../errors");

var _actions = require("./actions");

var _crud = require("./crud");

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== "function") return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function (nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache(nodeInterop);

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function unenrollAgentIsAllowed(soClient, esClient, agentId) {
  const agentPolicy = await (0, _crud.getAgentPolicyForAgent)(soClient, esClient, agentId);

  if (agentPolicy !== null && agentPolicy !== void 0 && agentPolicy.is_managed) {
    throw new _errors.HostedAgentPolicyRestrictionRelatedError(`Cannot unenroll ${agentId} from a hosted agent policy ${agentPolicy.id}`);
  }

  return true;
}

async function unenrollAgent(soClient, esClient, agentId, options) {
  if (!(options !== null && options !== void 0 && options.force)) {
    await unenrollAgentIsAllowed(soClient, esClient, agentId);
  }

  if (options !== null && options !== void 0 && options.revoke) {
    return forceUnenrollAgent(soClient, esClient, agentId);
  }

  const now = new Date().toISOString();
  await (0, _actions.createAgentAction)(esClient, {
    agent_id: agentId,
    created_at: now,
    type: 'UNENROLL'
  });
  await (0, _crud.updateAgent)(esClient, agentId, {
    unenrollment_started_at: now
  });
}

async function unenrollAgents(soClient, esClient, options) {
  // start with all agents specified
  const givenAgents = await (0, _crud.getAgents)(esClient, options); // Filter to those not already unenrolled, or unenrolling

  const agentsEnrolled = givenAgents.filter(agent => {
    if (options.revoke) {
      return !agent.unenrolled_at;
    }

    return !agent.unenrollment_started_at && !agent.unenrolled_at;
  }); // And which are allowed to unenroll

  const agentResults = await Promise.allSettled(agentsEnrolled.map(agent => unenrollAgentIsAllowed(soClient, esClient, agent.id).then(_ => agent)));
  const outgoingErrors = {};
  const agentsToUpdate = options.force ? agentsEnrolled : agentResults.reduce((agents, result, index) => {
    if (result.status === 'fulfilled') {
      agents.push(result.value);
    } else {
      const id = givenAgents[index].id;
      outgoingErrors[id] = result.reason;
    }

    return agents;
  }, []);
  const now = new Date().toISOString();

  if (options.revoke) {
    // Get all API keys that need to be invalidated
    await invalidateAPIKeysForAgents(agentsToUpdate);
  } else {
    // Create unenroll action for each agent
    await (0, _actions.bulkCreateAgentActions)(esClient, agentsToUpdate.map(agent => ({
      agent_id: agent.id,
      created_at: now,
      type: 'UNENROLL'
    })));
  } // Update the necessary agents


  const updateData = options.revoke ? {
    unenrolled_at: now,
    active: false
  } : {
    unenrollment_started_at: now
  };
  await (0, _crud.bulkUpdateAgents)(esClient, agentsToUpdate.map(({
    id
  }) => ({
    agentId: id,
    data: updateData
  })));

  const getResultForAgent = agent => {
    const hasError = (agent.id in outgoingErrors);
    const result = {
      id: agent.id,
      success: !hasError
    };

    if (hasError) {
      result.error = outgoingErrors[agent.id];
    }

    return result;
  };

  return {
    items: givenAgents.map(getResultForAgent)
  };
}

async function invalidateAPIKeysForAgents(agents) {
  const apiKeys = agents.reduce((keys, agent) => {
    if (agent.access_api_key_id) {
      keys.push(agent.access_api_key_id);
    }

    if (agent.default_api_key_id) {
      keys.push(agent.default_api_key_id);
    }

    return keys;
  }, []);

  if (apiKeys.length) {
    await APIKeyService.invalidateAPIKeys(apiKeys);
  }
}

async function forceUnenrollAgent(soClient, esClient, agentIdOrAgent) {
  const agent = typeof agentIdOrAgent === 'string' ? await (0, _crud.getAgentById)(esClient, agentIdOrAgent) : agentIdOrAgent;
  await invalidateAPIKeysForAgents([agent]);
  await (0, _crud.updateAgent)(esClient, agent.id, {
    active: false,
    unenrolled_at: new Date().toISOString()
  });
}