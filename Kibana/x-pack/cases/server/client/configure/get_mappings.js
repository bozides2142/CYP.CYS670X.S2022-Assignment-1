"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMappings = void 0;

var _server = require("../../../../actions/server");

var _error = require("../../common/error");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getMappings = async ({
  connector
}, clientArgs) => {
  const {
    unsecuredSavedObjectsClient,
    connectorMappingsService,
    logger
  } = clientArgs;

  try {
    const myConnectorMappings = await connectorMappingsService.find({
      unsecuredSavedObjectsClient,
      options: {
        hasReference: {
          type: _server.ACTION_SAVED_OBJECT_TYPE,
          id: connector.id
        }
      }
    });
    return myConnectorMappings.saved_objects;
  } catch (error) {
    throw (0, _error.createCaseError)({
      message: `Failed to retrieve mapping connector id: ${connector.id} type: ${connector.type}: ${error}`,
      error,
      logger
    });
  }
};

exports.getMappings = getMappings;