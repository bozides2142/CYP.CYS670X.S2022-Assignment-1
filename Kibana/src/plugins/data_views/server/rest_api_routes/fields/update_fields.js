"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateFields = exports.registerUpdateFieldsRouteLegacy = exports.registerUpdateFieldsRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _handle_errors = require("../util/handle_errors");

var _schemas = require("../util/schemas");

var _constants = require("../../constants");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const updateFields = async ({
  dataViewsService,
  usageCollection,
  counterName,
  id,
  fields
}) => {
  usageCollection === null || usageCollection === void 0 ? void 0 : usageCollection.incrementCounter({
    counterName
  });
  const dataView = await dataViewsService.get(id);
  const fieldNames = Object.keys(fields);

  if (fieldNames.length < 1) {
    throw new Error('No fields provided.');
  }

  let changeCount = 0;

  for (const fieldName of fieldNames) {
    const field = fields[fieldName];

    if (field.customLabel !== undefined) {
      changeCount++;
      dataView.setFieldCustomLabel(fieldName, field.customLabel);
    }

    if (field.count !== undefined) {
      changeCount++;
      dataView.setFieldCount(fieldName, field.count);
    }

    if (field.format !== undefined) {
      changeCount++;

      if (field.format) {
        dataView.setFieldFormat(fieldName, field.format);
      } else {
        dataView.deleteFieldFormat(fieldName);
      }
    }
  }

  if (changeCount < 1) {
    throw new Error('Change set is empty.');
  }

  await dataViewsService.updateSavedObject(dataView);
  return dataView;
};

exports.updateFields = updateFields;

const fieldUpdateSchema = _configSchema.schema.object({
  customLabel: _configSchema.schema.maybe(_configSchema.schema.nullable(_configSchema.schema.string({
    minLength: 1,
    maxLength: 1_000
  }))),
  count: _configSchema.schema.maybe(_configSchema.schema.nullable(_configSchema.schema.number())),
  format: _configSchema.schema.maybe(_configSchema.schema.nullable(_schemas.serializedFieldFormatSchema))
});

const updateFieldsActionRouteFactory = (path, serviceKey) => {
  return (router, getStartServices, usageCollection) => {
    router.post({
      path,
      validate: {
        params: _configSchema.schema.object({
          id: _configSchema.schema.string({
            minLength: 1,
            maxLength: 1_000
          })
        }, {
          unknowns: 'allow'
        }),
        body: _configSchema.schema.object({
          fields: _configSchema.schema.recordOf(_configSchema.schema.string({
            minLength: 1,
            maxLength: 1_000
          }), fieldUpdateSchema)
        })
      }
    }, router.handleLegacyErrors((0, _handle_errors.handleErrors)(async (ctx, req, res) => {
      const savedObjectsClient = ctx.core.savedObjects.client;
      const elasticsearchClient = ctx.core.elasticsearch.client.asCurrentUser;
      const [,, {
        dataViewsServiceFactory
      }] = await getStartServices();
      const dataViewsService = await dataViewsServiceFactory(savedObjectsClient, elasticsearchClient, req);
      const id = req.params.id;
      const {
        fields
      } = req.body;
      const dataView = await updateFields({
        dataViewsService,
        usageCollection,
        id,
        fields,
        counterName: `${req.route.method} ${path}`
      });
      return res.ok({
        headers: {
          'content-type': 'application/json'
        },
        body: {
          [serviceKey]: dataView.toSpec()
        }
      });
    })));
  };
};

const registerUpdateFieldsRouteLegacy = updateFieldsActionRouteFactory(`${_constants.SPECIFIC_DATA_VIEW_PATH}/fields`, _constants.SERVICE_KEY);
exports.registerUpdateFieldsRouteLegacy = registerUpdateFieldsRouteLegacy;
const registerUpdateFieldsRoute = updateFieldsActionRouteFactory(`${_constants.SPECIFIC_DATA_VIEW_PATH_LEGACY}/fields`, _constants.SERVICE_KEY_LEGACY);
exports.registerUpdateFieldsRoute = registerUpdateFieldsRoute;