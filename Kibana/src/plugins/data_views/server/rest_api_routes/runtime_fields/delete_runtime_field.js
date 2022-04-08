"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerDeleteRuntimeFieldRouteLegacy = exports.registerDeleteRuntimeFieldRoute = exports.deleteRuntimeField = void 0;

var _configSchema = require("@kbn/config-schema");

var _error = require("../../error");

var _handle_errors = require("../util/handle_errors");

var _constants = require("../../constants");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const deleteRuntimeField = async ({
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
    throw new Error('Only runtime fields can be deleted.');
  }

  dataView.removeRuntimeField(name);
  await dataViewsService.updateSavedObject(dataView);
};

exports.deleteRuntimeField = deleteRuntimeField;

const deleteRuntimeFieldRouteFactory = path => (router, getStartServices, usageCollection) => {
  router.delete({
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
    await deleteRuntimeField({
      dataViewsService,
      usageCollection,
      id,
      name,
      counterName: `${req.route.method} ${path}`
    });
    return res.ok();
  }));
};

const registerDeleteRuntimeFieldRoute = deleteRuntimeFieldRouteFactory(_constants.SPECIFIC_RUNTIME_FIELD_PATH);
exports.registerDeleteRuntimeFieldRoute = registerDeleteRuntimeFieldRoute;
const registerDeleteRuntimeFieldRouteLegacy = deleteRuntimeFieldRouteFactory(_constants.SPECIFIC_RUNTIME_FIELD_PATH_LEGACY);
exports.registerDeleteRuntimeFieldRouteLegacy = registerDeleteRuntimeFieldRouteLegacy;