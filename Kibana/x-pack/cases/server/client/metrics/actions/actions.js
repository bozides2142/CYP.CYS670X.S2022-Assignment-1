"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Actions = void 0;

var _lodash = require("lodash");

var _authorization = require("../../../authorization");

var _error = require("../../../common/error");

var _aggregation_handler = require("../aggregation_handler");

var _isolate_host = require("./aggregations/isolate_host");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class Actions extends _aggregation_handler.AggregationHandler {
  constructor(options) {
    super(options, new Map([['actions.isolateHost', new _isolate_host.IsolateHostActions()]]));
  }

  async compute() {
    const {
      unsecuredSavedObjectsClient,
      authorization,
      attachmentService,
      logger
    } = this.options.clientArgs;
    const {
      caseId,
      casesClient
    } = this.options;

    try {
      // This will perform an authorization check to ensure the user has access to the parent case
      const theCase = await casesClient.cases.get({
        id: caseId,
        includeComments: false
      });
      const {
        filter: authorizationFilter
      } = await authorization.getAuthorizationFilter(_authorization.Operations.getAttachmentMetrics);
      const aggregations = this.aggregationBuilders.reduce((aggs, aggregator) => {
        return { ...aggs,
          ...aggregator.build()
        };
      }, {});
      const response = await attachmentService.executeCaseActionsAggregations({
        unsecuredSavedObjectsClient,
        caseId: theCase.id,
        filter: authorizationFilter,
        aggregations
      });
      return this.aggregationBuilders.reduce((acc, aggregator) => (0, _lodash.merge)(acc, aggregator.formatResponse(response)), {});
    } catch (error) {
      throw (0, _error.createCaseError)({
        message: `Failed to compute actions attached case id: ${caseId}: ${error}`,
        error,
        logger
      });
    }
  }

}

exports.Actions = Actions;