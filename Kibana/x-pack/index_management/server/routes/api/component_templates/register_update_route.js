"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerUpdateRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _index = require("../index");

var _schema_validation = require("./schema_validation");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const paramsSchema = _configSchema.schema.object({
  name: _configSchema.schema.string()
});

const registerUpdateRoute = ({
  router,
  lib: {
    handleEsError
  }
}) => {
  router.put({
    path: (0, _index.addBasePath)('/component_templates/{name}'),
    validate: {
      body: _schema_validation.componentTemplateSchema,
      params: paramsSchema
    }
  }, async (context, request, response) => {
    const {
      client
    } = context.core.elasticsearch;
    const {
      name
    } = request.params;
    const {
      template,
      version,
      _meta
    } = request.body;

    try {
      // Verify component exists; ES will throw 404 if not
      await client.asCurrentUser.cluster.getComponentTemplate({
        name
      });
      const {
        body: responseBody
      } = await client.asCurrentUser.cluster.putComponentTemplate({
        name,
        body: {
          template: template,
          version,
          _meta
        }
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
};

exports.registerUpdateRoute = registerUpdateRoute;