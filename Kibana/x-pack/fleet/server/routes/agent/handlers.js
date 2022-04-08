"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateAgentHandler = exports.putAgentsReassignHandler = exports.postBulkAgentsReassignHandler = exports.getAgentsHandler = exports.getAgentStatusForAgentPolicyHandler = exports.getAgentHandler = exports.deleteAgentHandler = void 0;

var _errors = require("../../errors");

var _services = require("../../services");

var AgentService = _interopRequireWildcard(require("../../services/agents"));

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


const getAgentHandler = async (context, request, response) => {
  const soClient = context.core.savedObjects.client;
  const esClient = context.core.elasticsearch.client.asInternalUser;

  try {
    const body = {
      item: await AgentService.getAgentById(esClient, request.params.agentId)
    };
    return response.ok({
      body
    });
  } catch (error) {
    if (soClient.errors.isNotFoundError(error)) {
      return response.notFound({
        body: {
          message: `Agent ${request.params.agentId} not found`
        }
      });
    }

    return (0, _errors.defaultIngestErrorHandler)({
      error,
      response
    });
  }
};

exports.getAgentHandler = getAgentHandler;

const deleteAgentHandler = async (context, request, response) => {
  const esClient = context.core.elasticsearch.client.asInternalUser;

  try {
    await AgentService.deleteAgent(esClient, request.params.agentId);
    const body = {
      action: 'deleted'
    };
    return response.ok({
      body
    });
  } catch (error) {
    if (error.isBoom) {
      return response.customError({
        statusCode: error.output.statusCode,
        body: {
          message: `Agent ${request.params.agentId} not found`
        }
      });
    }

    return (0, _errors.defaultIngestErrorHandler)({
      error,
      response
    });
  }
};

exports.deleteAgentHandler = deleteAgentHandler;

const updateAgentHandler = async (context, request, response) => {
  const esClient = context.core.elasticsearch.client.asInternalUser;

  try {
    await AgentService.updateAgent(esClient, request.params.agentId, {
      user_provided_metadata: request.body.user_provided_metadata
    });
    const body = {
      item: await AgentService.getAgentById(esClient, request.params.agentId)
    };
    return response.ok({
      body
    });
  } catch (error) {
    if (error.isBoom && error.output.statusCode === 404) {
      return response.notFound({
        body: {
          message: `Agent ${request.params.agentId} not found`
        }
      });
    }

    return (0, _errors.defaultIngestErrorHandler)({
      error,
      response
    });
  }
};

exports.updateAgentHandler = updateAgentHandler;

const getAgentsHandler = async (context, request, response) => {
  const esClient = context.core.elasticsearch.client.asInternalUser;

  try {
    const {
      agents,
      total,
      page,
      perPage
    } = await AgentService.getAgentsByKuery(esClient, {
      page: request.query.page,
      perPage: request.query.perPage,
      showInactive: request.query.showInactive,
      showUpgradeable: request.query.showUpgradeable,
      kuery: request.query.kuery
    });
    const totalInactive = request.query.showInactive ? await AgentService.countInactiveAgents(esClient, {
      kuery: request.query.kuery
    }) : 0;
    const body = {
      list: agents,
      // deprecated
      items: agents,
      total,
      totalInactive,
      page,
      perPage
    };
    return response.ok({
      body
    });
  } catch (error) {
    return (0, _errors.defaultIngestErrorHandler)({
      error,
      response
    });
  }
};

exports.getAgentsHandler = getAgentsHandler;

const putAgentsReassignHandler = async (context, request, response) => {
  const soClient = context.core.savedObjects.client;
  const esClient = context.core.elasticsearch.client.asInternalUser;

  try {
    await AgentService.reassignAgent(soClient, esClient, request.params.agentId, request.body.policy_id);
    const body = {};
    return response.ok({
      body
    });
  } catch (error) {
    return (0, _errors.defaultIngestErrorHandler)({
      error,
      response
    });
  }
};

exports.putAgentsReassignHandler = putAgentsReassignHandler;

const postBulkAgentsReassignHandler = async (context, request, response) => {
  if (!_services.licenseService.isGoldPlus()) {
    return response.customError({
      statusCode: 403,
      body: {
        message: 'Requires Gold license'
      }
    });
  }

  const soClient = context.core.savedObjects.client;
  const esClient = context.core.elasticsearch.client.asInternalUser;
  const agentOptions = Array.isArray(request.body.agents) ? {
    agentIds: request.body.agents
  } : {
    kuery: request.body.agents
  };

  try {
    const results = await AgentService.reassignAgents(soClient, esClient, agentOptions, request.body.policy_id);
    const body = results.items.reduce((acc, so) => {
      var _so$error;

      acc[so.id] = {
        success: !so.error,
        error: (_so$error = so.error) === null || _so$error === void 0 ? void 0 : _so$error.message
      };
      return acc;
    }, {});
    return response.ok({
      body
    });
  } catch (error) {
    return (0, _errors.defaultIngestErrorHandler)({
      error,
      response
    });
  }
};

exports.postBulkAgentsReassignHandler = postBulkAgentsReassignHandler;

const getAgentStatusForAgentPolicyHandler = async (context, request, response) => {
  const esClient = context.core.elasticsearch.client.asInternalUser;

  try {
    // TODO change path
    const results = await AgentService.getAgentStatusForAgentPolicy(esClient, request.query.policyId, request.query.kuery);
    const body = {
      results
    };
    return response.ok({
      body
    });
  } catch (error) {
    return (0, _errors.defaultIngestErrorHandler)({
      error,
      response
    });
  }
};

exports.getAgentStatusForAgentPolicyHandler = getAgentStatusForAgentPolicyHandler;