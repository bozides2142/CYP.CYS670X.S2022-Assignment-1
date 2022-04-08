"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updatePreconfigurationHandler = exports.resetPreconfigurationHandler = exports.resetOnePreconfigurationHandler = void 0;

var _errors = require("../../errors");

var _services = require("../../services");

var _index = require("../../services/preconfiguration/index");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const updatePreconfigurationHandler = async (context, request, response) => {
  const soClient = context.core.savedObjects.client;
  const esClient = context.core.elasticsearch.client.asInternalUser;
  const defaultOutput = await _services.outputService.ensureDefaultOutput(soClient);
  const spaceId = context.fleet.spaceId;
  const {
    agentPolicies,
    packages
  } = request.body;

  try {
    var _ref;

    const body = await (0, _services.ensurePreconfiguredPackagesAndPolicies)(soClient, esClient, (_ref = agentPolicies) !== null && _ref !== void 0 ? _ref : [], packages !== null && packages !== void 0 ? packages : [], defaultOutput, spaceId);
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

exports.updatePreconfigurationHandler = updatePreconfigurationHandler;

const resetOnePreconfigurationHandler = async (context, request, response) => {
  const soClient = context.core.savedObjects.client;
  const esClient = context.core.elasticsearch.client.asInternalUser;

  try {
    await (0, _index.resetPreconfiguredAgentPolicies)(soClient, esClient, request.params.agentPolicyId);
    return response.ok({});
  } catch (error) {
    return (0, _errors.defaultIngestErrorHandler)({
      error,
      response
    });
  }
};

exports.resetOnePreconfigurationHandler = resetOnePreconfigurationHandler;

const resetPreconfigurationHandler = async (context, request, response) => {
  const soClient = context.core.savedObjects.client;
  const esClient = context.core.elasticsearch.client.asInternalUser;

  try {
    await (0, _index.resetPreconfiguredAgentPolicies)(soClient, esClient);
    return response.ok({});
  } catch (error) {
    return (0, _errors.defaultIngestErrorHandler)({
      error,
      response
    });
  }
};

exports.resetPreconfigurationHandler = resetPreconfigurationHandler;