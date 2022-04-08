"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFleetStatusHandler = exports.fleetSetupHandler = void 0;

var _services = require("../../services");

var _setup = require("../../services/setup");

var _fleet_server = require("../../services/fleet_server");

var _errors = require("../../errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getFleetStatusHandler = async (context, request, response) => {
  try {
    const isApiKeysEnabled = await _services.appContextService.getSecurity().authc.apiKeys.areAPIKeysEnabled();
    const isFleetServerSetup = await (0, _fleet_server.hasFleetServers)(context.core.elasticsearch.client.asInternalUser);
    const missingRequirements = [];

    if (!isApiKeysEnabled) {
      missingRequirements.push('api_keys');
    }

    if (!isFleetServerSetup) {
      missingRequirements.push('fleet_server');
    }

    const body = {
      isReady: missingRequirements.length === 0,
      missing_requirements: missingRequirements
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

exports.getFleetStatusHandler = getFleetStatusHandler;

const fleetSetupHandler = async (context, request, response) => {
  try {
    const soClient = context.fleet.epm.internalSoClient;
    const esClient = context.core.elasticsearch.client.asInternalUser;
    const setupStatus = await (0, _setup.setupFleet)(soClient, esClient);
    const body = { ...setupStatus,
      nonFatalErrors: (0, _setup.formatNonFatalErrors)(setupStatus.nonFatalErrors)
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

exports.fleetSetupHandler = fleetSetupHandler;