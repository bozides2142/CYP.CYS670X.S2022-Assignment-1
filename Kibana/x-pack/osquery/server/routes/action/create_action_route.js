"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createActionRoute = void 0;

var _lodash = require("lodash");

var _uuid = _interopRequireDefault(require("uuid"));

var _momentTimezone = _interopRequireDefault(require("moment-timezone"));

var _common = require("../../../common");

var _parse_agent_groups = require("../../lib/parse_agent_groups");

var _route_validation = require("../../utils/build_validation/route_validation");

var _create_action_request_body_schema = require("../../../common/schemas/routes/action/create_action_request_body_schema");

var _usage = require("../usage");

var _collector = require("../../usage/collector");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createActionRoute = (router, osqueryContext) => {
  router.post({
    path: '/internal/osquery/action',
    validate: {
      body: (0, _route_validation.buildRouteValidation)(_create_action_request_body_schema.createActionRequestBodySchema)
    },
    options: {
      tags: [`access:${_common.PLUGIN_ID}-readLiveQueries`, `access:${_common.PLUGIN_ID}-runSavedQueries`]
    }
  }, async (context, request, response) => {
    const esClient = context.core.elasticsearch.client.asInternalUser;
    const internalSavedObjectsClient = await (0, _collector.getInternalSavedObjectsClient)(osqueryContext.getStartServices);
    const {
      agentSelection
    } = request.body;
    const selectedAgents = await (0, _parse_agent_groups.parseAgentSelection)(internalSavedObjectsClient, osqueryContext, agentSelection);
    (0, _usage.incrementCount)(internalSavedObjectsClient, 'live_query');

    if (!selectedAgents.length) {
      (0, _usage.incrementCount)(internalSavedObjectsClient, 'live_query', 'errors');
      return response.badRequest({
        body: new Error('No agents found for selection')
      });
    } // TODO: Add check for `runSavedQueries` only


    try {
      var _osqueryContext$secur;

      const currentUser = await ((_osqueryContext$secur = osqueryContext.security.authc.getCurrentUser(request)) === null || _osqueryContext$secur === void 0 ? void 0 : _osqueryContext$secur.username);
      const action = {
        action_id: _uuid.default.v4(),
        '@timestamp': (0, _momentTimezone.default)().toISOString(),
        expiration: (0, _momentTimezone.default)().add(5, 'minutes').toISOString(),
        type: 'INPUT_ACTION',
        input_type: 'osquery',
        agents: selectedAgents,
        user_id: currentUser,
        data: (0, _lodash.pickBy)({
          id: _uuid.default.v4(),
          query: request.body.query,
          saved_query_id: request.body.saved_query_id,
          ecs_mapping: request.body.ecs_mapping
        }, value => !(0, _lodash.isEmpty)(value))
      };
      const actionResponse = await esClient.index({
        index: '.fleet-actions',
        body: action
      });
      return response.ok({
        body: {
          response: actionResponse,
          actions: [action]
        }
      });
    } catch (error) {
      (0, _usage.incrementCount)(internalSavedObjectsClient, 'live_query', 'errors');
      return response.customError({
        statusCode: 500,
        body: new Error(`Error occurred while processing ${error}`)
      });
    }
  });
};

exports.createActionRoute = createActionRoute;