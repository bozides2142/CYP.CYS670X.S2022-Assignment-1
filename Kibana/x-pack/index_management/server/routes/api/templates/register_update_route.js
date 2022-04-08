"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerUpdateRoute = registerUpdateRoute;

var _configSchema = require("@kbn/config-schema");

var _index = require("../index");

var _validate_schemas = require("./validate_schemas");

var _lib = require("./lib");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const bodySchema = _validate_schemas.templateSchema;

const paramsSchema = _configSchema.schema.object({
  name: _configSchema.schema.string()
});

function registerUpdateRoute({
  router,
  lib: {
    handleEsError
  }
}) {
  router.put({
    path: (0, _index.addBasePath)('/index_templates/{name}'),
    validate: {
      body: bodySchema,
      params: paramsSchema
    }
  }, async (context, request, response) => {
    const {
      client
    } = context.core.elasticsearch;
    const {
      name
    } = request.params;
    const template = request.body;

    try {
      const {
        _kbnMeta: {
          isLegacy
        }
      } = template; // Verify the template exists (ES will throw 404 if not)

      const {
        body: templateExists
      } = await (0, _lib.doesTemplateExist)({
        name,
        client,
        isLegacy
      });

      if (!templateExists) {
        return response.notFound();
      } // Next, update index template


      const {
        body: responseBody
      } = await (0, _lib.saveTemplate)({
        template,
        client,
        isLegacy
      });
      return response.ok({
        body: responseBody
      });
    } catch (error) {
      return handleEsError({
        error,
        response
      });
    }
  });
}