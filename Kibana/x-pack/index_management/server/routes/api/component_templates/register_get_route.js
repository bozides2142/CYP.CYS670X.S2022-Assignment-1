"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerGetAllRoute = registerGetAllRoute;

var _configSchema = require("@kbn/config-schema");

var _lib = require("../../../../common/lib");

var _index = require("../index");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const paramsSchema = _configSchema.schema.object({
  name: _configSchema.schema.string()
});

function registerGetAllRoute({
  router,
  lib: {
    handleEsError
  }
}) {
  // Get all component templates
  router.get({
    path: (0, _index.addBasePath)('/component_templates'),
    validate: false
  }, async (context, request, response) => {
    const {
      client
    } = context.core.elasticsearch;

    try {
      const {
        body: {
          component_templates: componentTemplates
        }
      } = await client.asCurrentUser.cluster.getComponentTemplate();
      const {
        body: {
          index_templates: indexTemplates
        }
      } = await client.asCurrentUser.indices.getIndexTemplate();
      const body = componentTemplates.map(componentTemplate => {
        const deserializedComponentTemplateListItem = (0, _lib.deserializeComponentTemplateList)(componentTemplate, indexTemplates);
        return deserializedComponentTemplateListItem;
      });
      return response.ok({
        body
      });
    } catch (error) {
      return handleEsError({
        error,
        response
      });
    }
  }); // Get single component template

  router.get({
    path: (0, _index.addBasePath)('/component_templates/{name}'),
    validate: {
      params: paramsSchema
    }
  }, async (context, request, response) => {
    const {
      client
    } = context.core.elasticsearch;
    const {
      name
    } = request.params;

    try {
      const {
        body: {
          component_templates: componentTemplates
        }
      } = await client.asCurrentUser.cluster.getComponentTemplate({
        name
      });
      const {
        body: {
          index_templates: indexTemplates
        }
      } = await client.asCurrentUser.indices.getIndexTemplate();
      return response.ok({
        body: (0, _lib.deserializeComponentTemplate)(componentTemplates[0], indexTemplates)
      });
    } catch (error) {
      return handleEsError({
        error,
        response
      });
    }
  });
}