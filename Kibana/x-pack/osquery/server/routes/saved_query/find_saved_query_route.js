"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findSavedQueryRoute = void 0;

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


const findSavedQueryRoute = router => {
  router.get({
    path: '/internal/osquery/saved_query',
    validate: {
      query: _configSchema.schema.object({
        pageIndex: _configSchema.schema.maybe(_configSchema.schema.string()),
        pageSize: _configSchema.schema.maybe(_configSchema.schema.number()),
        sortField: _configSchema.schema.maybe(_configSchema.schema.string()),
        sortOrder: _configSchema.schema.maybe(_configSchema.schema.string())
      }, {
        unknowns: 'allow'
      })
    },
    options: {
      tags: [`access:${_common.PLUGIN_ID}-readSavedQueries`]
    }
  }, async (context, request, response) => {
    var _request$query$pageIn, _request$query$sortDi;

    const savedObjectsClient = context.core.savedObjects.client;
    const savedQueries = await savedObjectsClient.find({
      type: _types.savedQuerySavedObjectType,
      page: parseInt((_request$query$pageIn = request.query.pageIndex) !== null && _request$query$pageIn !== void 0 ? _request$query$pageIn : '0', 10) + 1,
      perPage: request.query.pageSize,
      sortField: request.query.sortField,
      // @ts-expect-error update types
      sortOrder: (_request$query$sortDi = request.query.sortDirection) !== null && _request$query$sortDi !== void 0 ? _request$query$sortDi : 'desc'
    });
    const savedObjects = savedQueries.saved_objects.map(savedObject => {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const ecs_mapping = savedObject.attributes.ecs_mapping;

      if (ecs_mapping) {
        // @ts-expect-error update types
        savedObject.attributes.ecs_mapping = (0, _utils.convertECSMappingToObject)(ecs_mapping);
      }

      return savedObject;
    });
    return response.ok({
      body: { ...savedQueries,
        saved_objects: savedObjects
      }
    });
  });
};

exports.findSavedQueryRoute = findSavedQueryRoute;