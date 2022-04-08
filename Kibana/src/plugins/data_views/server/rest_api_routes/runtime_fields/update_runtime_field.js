"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateRuntimeField = exports.registerUpdateRuntimeFieldRouteLegacy = exports.registerUpdateRuntimeFieldRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _error = require("../../error");

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
const updateRuntimeField = async ({
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
  const existingRuntimeField = dataView.getRuntimeField(name);

  if (!existingRuntimeField) {
    throw new _error.ErrorIndexPatternFieldNotFound(id, name);
  }

  dataView.removeRuntimeField(name);
  dataView.addRuntimeField(name, { ...existingRuntimeField,
    ...runtimeField
  });
  await dataViewsService.updateSavedObject(dataView);
  const field = dataView.fields.getByName(name);
  if (!field) throw new Error(`Could not create a field [name = ${name}].`);
  return {
    dataView,
    field
  };
};

exports.updateRuntimeField = updateRuntimeField;

const updateRuntimeFieldRouteFactory = (path, serviceKey) => (router, getStartServices, usageCollection) => {
  router.post({
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
      }),
      body: _configSchema.schema.object({
        name: _configSchema.schema.never(),
        runtimeField: _configSchema.schema.object({ ..._schemas.runtimeFieldSpec,
          // We need to overwrite the below fields on top of `runtimeFieldSpec`,
          // because some fields would be optional
          type: _configSchema.schema.maybe(_schemas.runtimeFieldSpecTypeSchema)
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
    const runtimeField = req.body.runtimeField;
    const {
      dataView,
      field
    } = await updateRuntimeField({
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

const registerUpdateRuntimeFieldRoute = updateRuntimeFieldRouteFactory(_constants.SPECIFIC_RUNTIME_FIELD_PATH, _constants.SERVICE_KEY);
exports.registerUpdateRuntimeFieldRoute = registerUpdateRuntimeFieldRoute;
const registerUpdateRuntimeFieldRouteLegacy = updateRuntimeFieldRouteFactory(_constants.SPECIFIC_RUNTIME_FIELD_PATH_LEGACY, _constants.SERVICE_KEY_LEGACY);
exports.registerUpdateRuntimeFieldRouteLegacy = registerUpdateRuntimeFieldRouteLegacy;