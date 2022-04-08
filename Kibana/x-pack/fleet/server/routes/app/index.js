"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerRoutes = exports.getCheckPermissionsHandler = exports.generateServiceTokenHandler = void 0;

var _constants = require("../../constants");

var _services = require("../../services");

var _errors = require("../../errors");

var _types = require("../../types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getCheckPermissionsHandler = async (context, request, response) => {
  const missingSecurityBody = {
    success: false,
    error: 'MISSING_SECURITY'
  };

  if (!_services.appContextService.getSecurityLicense().isEnabled()) {
    return response.ok({
      body: missingSecurityBody
    });
  } else {
    if (!context.fleet.authz.fleet.all) {
      return response.ok({
        body: {
          success: false,
          error: 'MISSING_PRIVILEGES'
        }
      });
    } // check the manage_service_account cluster privilege
    else if (request.query.fleetServerSetup) {
      const esClient = context.core.elasticsearch.client.asCurrentUser;
      const {
        body: {
          has_all_requested: hasAllPrivileges
        }
      } = await esClient.security.hasPrivileges({
        body: {
          cluster: ['manage_service_account']
        }
      });

      if (!hasAllPrivileges) {
        return response.ok({
          body: {
            success: false,
            error: 'MISSING_FLEET_SERVER_SETUP_PRIVILEGES'
          }
        });
      }
    }

    return response.ok({
      body: {
        success: true
      }
    });
  }
};

exports.getCheckPermissionsHandler = getCheckPermissionsHandler;

const generateServiceTokenHandler = async (context, request, response) => {
  // Generate the fleet server service token as the current user as the internal user do not have the correct permissions
  const esClient = context.core.elasticsearch.client.asCurrentUser;

  try {
    const {
      body: tokenResponse
    } = await esClient.transport.request({
      method: 'POST',
      path: `_security/service/elastic/fleet-server/credential/token/token-${Date.now()}`
    });

    if (tokenResponse.created && tokenResponse.token) {
      const body = tokenResponse.token;
      return response.ok({
        body
      });
    } else {
      const error = new _errors.GenerateServiceTokenError('Unable to generate service token');
      return (0, _errors.defaultIngestErrorHandler)({
        error,
        response
      });
    }
  } catch (e) {
    const error = new _errors.GenerateServiceTokenError(e);
    return (0, _errors.defaultIngestErrorHandler)({
      error,
      response
    });
  }
};

exports.generateServiceTokenHandler = generateServiceTokenHandler;

const registerRoutes = router => {
  router.get({
    path: _constants.APP_API_ROUTES.CHECK_PERMISSIONS_PATTERN,
    validate: _types.CheckPermissionsRequestSchema,
    options: {
      tags: []
    }
  }, getCheckPermissionsHandler);
  router.post({
    path: _constants.APP_API_ROUTES.GENERATE_SERVICE_TOKEN_PATTERN,
    validate: {},
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, generateServiceTokenHandler);
  router.post({
    path: _constants.APP_API_ROUTES.GENERATE_SERVICE_TOKEN_PATTERN_DEPRECATED,
    validate: {},
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, generateServiceTokenHandler);
};

exports.registerRoutes = registerRoutes;