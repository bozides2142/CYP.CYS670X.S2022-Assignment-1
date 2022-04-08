"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerRoutes = void 0;

var _constants = require("../../constants");

var _types = require("../../types");

var _handler = require("./handler");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const registerRoutes = router => {
  router.post({
    path: _constants.PRECONFIGURATION_API_ROUTES.RESET_PATTERN,
    validate: false,
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, _handler.resetPreconfigurationHandler);
  router.post({
    path: _constants.PRECONFIGURATION_API_ROUTES.RESET_ONE_PATTERN,
    validate: _types.PostResetOnePreconfiguredAgentPoliciesSchema,
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, _handler.resetOnePreconfigurationHandler);
  router.put({
    path: _constants.PRECONFIGURATION_API_ROUTES.UPDATE_PATTERN,
    validate: _types.PutPreconfigurationSchema,
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, _handler.updatePreconfigurationHandler);
};

exports.registerRoutes = registerRoutes;