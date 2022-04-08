"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Connectors = void 0;

var _authorization = require("../../authorization");

var _error = require("../../common/error");

var _base_handler = require("./base_handler");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class Connectors extends _base_handler.BaseHandler {
  constructor(options) {
    super(options, ['connectors']);
  }

  async compute() {
    const {
      unsecuredSavedObjectsClient,
      authorization,
      userActionService,
      logger
    } = this.options.clientArgs;
    const {
      caseId
    } = this.options;
    const {
      filter: authorizationFilter
    } = await authorization.getAuthorizationFilter(_authorization.Operations.getUserActionMetrics);
    const uniqueConnectors = await userActionService.getUniqueConnectors({
      unsecuredSavedObjectsClient,
      caseId,
      filter: authorizationFilter
    });

    try {
      return {
        connectors: {
          total: uniqueConnectors.length
        }
      };
    } catch (error) {
      throw (0, _error.createCaseError)({
        message: `Failed to retrieve total connectors metrics for case id: ${caseId}: ${error}`,
        error,
        logger
      });
    }
  }

}

exports.Connectors = Connectors;