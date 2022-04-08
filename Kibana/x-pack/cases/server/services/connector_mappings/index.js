"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConnectorMappingsService = void 0;

var _constants = require("../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class ConnectorMappingsService {
  constructor(log) {
    this.log = log;
  }

  async find({
    unsecuredSavedObjectsClient,
    options
  }) {
    try {
      this.log.debug(`Attempting to find all connector mappings`);
      return await unsecuredSavedObjectsClient.find({ ...options,
        type: _constants.CASE_CONNECTOR_MAPPINGS_SAVED_OBJECT
      });
    } catch (error) {
      this.log.error(`Attempting to find all connector mappings: ${error}`);
      throw error;
    }
  }

  async post({
    unsecuredSavedObjectsClient,
    attributes,
    references
  }) {
    try {
      this.log.debug(`Attempting to POST a new connector mappings`);
      return await unsecuredSavedObjectsClient.create(_constants.CASE_CONNECTOR_MAPPINGS_SAVED_OBJECT, attributes, {
        references
      });
    } catch (error) {
      this.log.error(`Error on POST a new connector mappings: ${error}`);
      throw error;
    }
  }

  async update({
    unsecuredSavedObjectsClient,
    mappingId,
    attributes,
    references
  }) {
    try {
      this.log.debug(`Attempting to UPDATE connector mappings ${mappingId}`);
      return await unsecuredSavedObjectsClient.update(_constants.CASE_CONNECTOR_MAPPINGS_SAVED_OBJECT, mappingId, attributes, {
        references
      });
    } catch (error) {
      this.log.error(`Error on UPDATE connector mappings ${mappingId}: ${error}`);
      throw error;
    }
  }

}

exports.ConnectorMappingsService = ConnectorMappingsService;