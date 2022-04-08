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
  router.get({
    path: _constants.OUTPUT_API_ROUTES.LIST_PATTERN,
    validate: _types.GetOutputsRequestSchema,
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, _handler.getOutputsHandler);
  router.get({
    path: _constants.OUTPUT_API_ROUTES.INFO_PATTERN,
    validate: _types.GetOneOutputRequestSchema,
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, _handler.getOneOuputHandler);
  router.put({
    path: _constants.OUTPUT_API_ROUTES.UPDATE_PATTERN,
    validate: _types.PutOutputRequestSchema,
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, _handler.putOuputHandler);
  router.post({
    path: _constants.OUTPUT_API_ROUTES.CREATE_PATTERN,
    validate: _types.PostOutputRequestSchema,
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, _handler.postOuputHandler);
  router.delete({
    path: _constants.OUTPUT_API_ROUTES.DELETE_PATTERN,
    validate: _types.DeleteOutputRequestSchema,
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, _handler.deleteOutputHandler);
};

exports.registerRoutes = registerRoutes;