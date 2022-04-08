"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerCreateRuntimeFieldRouteLegacy = exports.registerCreateRuntimeFieldRoute = exports.createRuntimeField = void 0;

var _configSchema = require("@kbn/config-schema");

var _handle_errors = require("../util/handle_errors");

var _schemas = require("../util/schemas");

var _constants = require("../../constants");

var _response_formatter = require("./response_formatter");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const createRuntimeField = async ({
  dataViewsService,
  usageCollection,
  counterName,
  id,
  name,
  runtimeField
}) => {
  usageCollection === null || usageCollection === void 0 ? void 0 : usageCollection.incrementCounter({
    counterName
  });
  const dataView = await dataViewsService.get(id);

  if (dataView.fields.getByName(name)) {
    throw new Error(`Field [name = ${name}] already exists.`);
  }

  dataView.addRuntimeField(name, runtimeField);
  const field = dataView.fields.getByName(name);
  if (!field) throw new Error(`Could not create a field [name = ${name}].`);
  await dataViewsService.updateSavedObject(dataView);
  return {
    dataView,
    field
  };
};

exports.createRuntimeField = createRuntimeField;

const runtimeCreateFieldRouteFactory = (path, serviceKey) => (router, getStartServices, usageCollection) => {
  router.post({
    path,
    validate: {
      params: _configSchema.schema.object({
        id: _configSchema.schema.string({
          minLength: 1,
          maxLength: 1_000
        })
      }),
      body: _configSchema.schema.object({
        name: _configSchema.schema.string({
          minLength: 1,
          maxLength: 1_000
        }),
        runtimeField: _schemas.runtimeFieldSpecSchema
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
    const {
      name,
      runtimeField
    } = req.body;
    const {
      dataView,
      field
    } = await createRuntimeField({
      dataViewsService,
      usageCollection,
      counterName: `${req.route.method} ${path}`,
      id,
      name,
      runtimeField
    });
    return res.ok((0, _response_formatter.responseFormatter)({
      serviceKey,
      dataView,
      field
    }));
  }));
};

const registerCreateRuntimeFieldRoute = runtimeCreateFieldRouteFactory(_constants.RUNTIME_FIELD_PATH, _constants.SERVICE_KEY);
exports.registerCreateRuntimeFieldRoute = registerCreateRuntimeFieldRoute;
const registerCreateRuntimeFieldRouteLegacy = runtimeCreateFieldRouteFactory(_constants.RUNTIME_FIELD_PATH_LEGACY, _constants.SERVICE_KEY_LEGACY);
exports.registerCreateRuntimeFieldRouteLegacy = registerCreateRuntimeFieldRouteLegacy;