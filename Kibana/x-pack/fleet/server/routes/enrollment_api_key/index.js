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
    path: _constants.ENROLLMENT_API_KEY_ROUTES.INFO_PATTERN,
    validate: _types.GetOneEnrollmentAPIKeyRequestSchema,
    fleetAuthz: {
      fleet: {
        readEnrollmentTokens: true
      }
    }
  }, _handler.getOneEnrollmentApiKeyHandler);
  router.delete({
    path: _constants.ENROLLMENT_API_KEY_ROUTES.DELETE_PATTERN,
    validate: _types.DeleteEnrollmentAPIKeyRequestSchema,
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, _handler.deleteEnrollmentApiKeyHandler);
  router.get({
    path: _constants.ENROLLMENT_API_KEY_ROUTES.LIST_PATTERN,
    validate: _types.GetEnrollmentAPIKeysRequestSchema,
    fleetAuthz: {
      fleet: {
        readEnrollmentTokens: true
      }
    }
  }, _handler.getEnrollmentApiKeysHandler);
  router.post({
    path: _constants.ENROLLMENT_API_KEY_ROUTES.CREATE_PATTERN,
    validate: _types.PostEnrollmentAPIKeyRequestSchema,
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, _handler.postEnrollmentApiKeyHandler);
  router.get({
    path: _constants.ENROLLMENT_API_KEY_ROUTES.INFO_PATTERN_DEPRECATED,
    validate: _types.GetOneEnrollmentAPIKeyRequestSchema,
    fleetAuthz: {
      fleet: {
        readEnrollmentTokens: true
      }
    }
  }, _handler.getOneEnrollmentApiKeyHandler);
  router.delete({
    path: _constants.ENROLLMENT_API_KEY_ROUTES.DELETE_PATTERN_DEPRECATED,
    validate: _types.DeleteEnrollmentAPIKeyRequestSchema,
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, _handler.deleteEnrollmentApiKeyHandler);
  router.get({
    path: _constants.ENROLLMENT_API_KEY_ROUTES.LIST_PATTERN_DEPRECATED,
    validate: _types.GetEnrollmentAPIKeysRequestSchema,
    fleetAuthz: {
      fleet: {
        readEnrollmentTokens: true
      }
    }
  }, _handler.getEnrollmentApiKeysHandler);
  router.post({
    path: _constants.ENROLLMENT_API_KEY_ROUTES.CREATE_PATTERN_DEPRECATED,
    validate: _types.PostEnrollmentAPIKeyRequestSchema,
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, _handler.postEnrollmentApiKeyHandler);
};

exports.registerRoutes = registerRoutes;