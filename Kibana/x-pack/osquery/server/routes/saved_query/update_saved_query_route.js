"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateSavedQueryRoute = void 0;

var _lodash = require("lodash");

var _configSchema = require("@kbn/config-schema");

var _common = require("../../../common");

var _types = require("../../../common/types");

var _utils = require("../utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const updateSavedQueryRoute = (router, osqueryContext) => {
  router.put({
    path: '/internal/osquery/saved_query/{id}',
    validate: {
      params: _configSchema.schema.object({
        id: _configSchema.schema.string()
      }),
      body: _configSchema.schema.object({
        id: _configSchema.schema.string(),
        query: _configSchema.schema.string(),
        description: _configSchema.schema.maybe(_configSchema.schema.string()),
        interval: _configSchema.schema.maybe(_configSchema.schema.number()),
        platform: _configSchema.schema.maybe(_configSchema.schema.string()),
        version: _configSchema.schema.maybe(_configSchema.schema.string()),
        ecs_mapping: _configSchema.schema.maybe(_configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.object({
          field: _configSchema.schema.maybe(_configSchema.schema.string()),
          value: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.string(), _configSchema.schema.arrayOf(_configSchema.schema.string())]))
        })))
      }, {
        unknowns: 'allow'
      })
    },
    options: {
      tags: [`access:${_common.PLUGIN_ID}-writeSavedQueries`]
    }
  }, async (context, request, response) => {
    var _osqueryContext$secur;

    const savedObjectsClient = context.core.savedObjects.client;
    const currentUser = await ((_osqueryContext$secur = osqueryContext.security.authc.getCurrentUser(request)) === null || _osqueryContext$secur === void 0 ? void 0 : _osqueryContext$secur.username);
    const {
      id,
      description,
      platform,
      query,
      version,
      interval,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      ecs_mapping
    } = request.body;
    const conflictingEntries = await savedObjectsClient.find({
      type: _types.savedQuerySavedObjectType,
      filter: `${_types.savedQuerySavedObjectType}.attributes.id: "${id}"`
    });

    if ((0, _lodash.filter)(conflictingEntries.saved_objects, soObject => soObject.id !== request.params.id).length) {
      return response.conflict({
        body: `Saved query with id "${id}" already exists.`
      });
    }

    const updatedSavedQuerySO = await savedObjectsClient.update(_types.savedQuerySavedObjectType, request.params.id, {
      id,
      description: description || '',
      platform,
      query,
      version,
      interval,
      ecs_mapping: (0, _utils.convertECSMappingToArray)(ecs_mapping),
      updated_by: currentUser,
      updated_at: new Date().toISOString()
    }, {
      refresh: 'wait_for'
    });

    if (ecs_mapping || updatedSavedQuerySO.attributes.ecs_mapping) {
      // @ts-expect-error update types
      updatedSavedQuerySO.attributes.ecs_mapping = ecs_mapping || updatedSavedQuerySO.attributes.ecs_mapping && // @ts-expect-error update types
      (0, _utils.convertECSMappingToObject)(updatedSavedQuerySO.attributes.ecs_mapping) || {};
    }

    return response.ok({
      body: updatedSavedQuerySO
    });
  });
};

exports.updateSavedQueryRoute = updateSavedQueryRoute;