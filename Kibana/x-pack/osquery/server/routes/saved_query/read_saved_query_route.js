"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readSavedQueryRoute = void 0;

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


const readSavedQueryRoute = router => {
  router.get({
    path: '/internal/osquery/saved_query/{id}',
    validate: {
      params: _configSchema.schema.object({
        id: _configSchema.schema.string()
      })
    },
    options: {
      tags: [`access:${_common.PLUGIN_ID}-readSavedQueries`]
    }
  }, async (context, request, response) => {
    const savedObjectsClient = context.core.savedObjects.client;
    const savedQuery = await savedObjectsClient.get(_types.savedQuerySavedObjectType, request.params.id);

    if (savedQuery.attributes.ecs_mapping) {
      // @ts-expect-error update types
      savedQuery.attributes.ecs_mapping = (0, _utils.convertECSMappingToObject)(savedQuery.attributes.ecs_mapping);
    }

    return response.ok({
      body: savedQuery
    });
  });
};

exports.readSavedQueryRoute = readSavedQueryRoute;