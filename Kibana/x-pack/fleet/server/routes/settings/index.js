"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerRoutes = exports.putSettingsHandler = exports.getSettingsHandler = void 0;

var _constants = require("../../constants");

var _types = require("../../types");

var _errors = require("../../errors");

var _services = require("../../services");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getSettingsHandler = async (context, request, response) => {
  const soClient = context.fleet.epm.internalSoClient;

  try {
    const settings = await _services.settingsService.getSettings(soClient);
    const body = {
      item: settings
    };
    return response.ok({
      body
    });
  } catch (error) {
    if (error.isBoom && error.output.statusCode === 404) {
      return response.notFound({
        body: {
          message: `Settings not found`
        }
      });
    }

    return (0, _errors.defaultIngestErrorHandler)({
      error,
      response
    });
  }
};

exports.getSettingsHandler = getSettingsHandler;

const putSettingsHandler = async (context, request, response) => {
  var _appContextService$ge;

  const soClient = context.fleet.epm.internalSoClient;
  const esClient = context.core.elasticsearch.client.asInternalUser;
  const user = await ((_appContextService$ge = _services.appContextService.getSecurity()) === null || _appContextService$ge === void 0 ? void 0 : _appContextService$ge.authc.getCurrentUser(request));

  try {
    const settings = await _services.settingsService.saveSettings(soClient, request.body);
    await _services.agentPolicyService.bumpAllAgentPolicies(soClient, esClient, {
      user: user || undefined
    });
    const body = {
      item: settings
    };
    return response.ok({
      body
    });
  } catch (error) {
    if (error.isBoom && error.output.statusCode === 404) {
      return response.notFound({
        body: {
          message: `Settings not found`
        }
      });
    }

    return (0, _errors.defaultIngestErrorHandler)({
      error,
      response
    });
  }
};

exports.putSettingsHandler = putSettingsHandler;

const registerRoutes = router => {
  router.get({
    path: _constants.SETTINGS_API_ROUTES.INFO_PATTERN,
    validate: _types.GetSettingsRequestSchema,
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, getSettingsHandler);
  router.put({
    path: _constants.SETTINGS_API_ROUTES.UPDATE_PATTERN,
    validate: _types.PutSettingsRequestSchema,
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, putSettingsHandler);
};

exports.registerRoutes = registerRoutes;