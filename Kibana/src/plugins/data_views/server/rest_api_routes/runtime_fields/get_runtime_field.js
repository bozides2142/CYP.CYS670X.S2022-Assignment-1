"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerGetRuntimeFieldRouteLegacy = exports.registerGetRuntimeFieldRoute = exports.getRuntimeField = void 0;

var _configSchema = require("@kbn/config-schema");

var _error = require("../../error");

var _handle_errors = require("../util/handle_errors");

var _constants = require("../../constants");

var _response_formatter = require("./response_formatter");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const getRuntimeField = async ({
  dataViewsService,
  usageCollection,
  counterName,
  id,
  name
}) => {
  usageCollection === null || usageCollection === void 0 ? void 0 : usageCollection.incrementCounter({
    counterName
  });
  const dataView = await dataViewsService.get(id);
  const field = dataView.fields.getByName(name);

  if (!field) {
    throw new _error.ErrorIndexPatternFieldNotFound(id, name);
  }

  if (!field.runtimeField) {
    throw new Error('Only runtime fields can be retrieved.');
  }

  return {
    dataView,
    field
  };
};

exports.getRuntimeField = getRuntimeField;

const getRuntimeFieldRouteFactory = (path, serviceKey) => (router, getStartServices, usageCollection) => {
  router.get({
    path,
    validate: {
      params: _configSchema.schema.object({
        id: _configSchema.schema.string({
          minLength: 1,
          maxLength: 1_000
        }),
        name: _configSchema.schema.string({
          minLength: 1,
          maxLength: 1_000
        })
      })
    }
  }, (0, _handle_errors.handleErrors)(async (ctx, req, res) => {
    const savedObjectsClient = ctx.core.savedObjects.client;
    const elasticsearchClient = ctx.core.elasticsearch.client.asCurrentUser;
    const [,, {
      dataViewsServiceFactory
    }] = await getStartServices();
    const dataViewsService = await dataViewsServiceFactory(savedObjectsClient, elasticsearchClient, req);
    const id = req.params.id;
    const name = req.params.name;
    const {
      dataView,
      field
    } = await getRuntimeField({
      dataViewsService,
      usageCollection,
      counterName: `${req.route.method} ${path}`,
      id,
      name
    });
    return res.ok((0, _response_formatter.responseFormatter)({
      serviceKey,
      dataView,
      field
    }));
  }));
};

const registerGetRuntimeFieldRoute = getRuntimeFieldRouteFactory(_constants.SPECIFIC_RUNTIME_FIELD_PATH, _constants.SERVICE_KEY);
exports.registerGetRuntimeFieldRoute = registerGetRuntimeFieldRoute;
const registerGetRuntimeFieldRouteLegacy = getRuntimeFieldRouteFactory(_constants.SPECIFIC_RUNTIME_FIELD_PATH_LEGACY, _constants.SERVICE_KEY_LEGACY);
exports.registerGetRuntimeFieldRouteLegacy = registerGetRuntimeFieldRouteLegacy;