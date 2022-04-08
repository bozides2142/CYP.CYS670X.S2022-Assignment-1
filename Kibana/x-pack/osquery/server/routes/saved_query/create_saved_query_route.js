"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSavedQueryRoute = void 0;

var _lodash = require("lodash");

var _common = require("../../../common");

var _create_saved_query_request_schema = require("../../../common/schemas/routes/saved_query/create_saved_query_request_schema");

var _types = require("../../../common/types");

var _route_validation = require("../../utils/build_validation/route_validation");

var _utils = require("../utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createSavedQueryRoute = (router, osqueryContext) => {
  router.post({
    path: '/internal/osquery/saved_query',
    validate: {
      body: (0, _route_validation.buildRouteValidation)(_create_saved_query_request_schema.createSavedQueryRequestSchema)
    },
    options: {
      tags: [`access:${_common.PLUGIN_ID}-writeSavedQueries`]
    }
  }, async (context, request, response) => {
    var _osqueryContext$secur;

    const savedObjectsClient = context.core.savedObjects.client; // eslint-disable-next-line @typescript-eslint/naming-convention

    const {
      id,
      description,
      platform,
      query,
      version,
      interval,
      ecs_mapping
    } = request.body;
    const currentUser = await ((_osqueryContext$secur = osqueryContext.security.authc.getCurrentUser(request)) === null || _osqueryContext$secur === void 0 ? void 0 : _osqueryContext$secur.username);
    const conflictingEntries = await savedObjectsClient.find({
      type: _types.savedQuerySavedObjectType,
      filter: `${_types.savedQuerySavedObjectType}.attributes.id: "${id}"`
    });

    if (conflictingEntries.saved_objects.length) {
      return response.conflict({
        body: `Saved query with id "${id}" already exists.`
      });
    }

    const savedQuerySO = await savedObjectsClient.create(_types.savedQuerySavedObjectType, (0, _lodash.pickBy)({
      id,
      description,
      query,
      platform,
      version,
      interval,
      ecs_mapping: (0, _utils.convertECSMappingToArray)(ecs_mapping),
      created_by: currentUser,
      created_at: new Date().toISOString(),
      updated_by: currentUser,
      updated_at: new Date().toISOString()
    }, value => !(0, _lodash.isEmpty)(value)));
    return response.ok({
      body: (0, _lodash.pickBy)({ ...savedQuerySO,
        ecs_mapping
      }, value => !(0, _lodash.isEmpty)(value))
    });
  });
};

exports.createSavedQueryRoute = createSavedQueryRoute;