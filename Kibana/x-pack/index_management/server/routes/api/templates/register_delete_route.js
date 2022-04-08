"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerDeleteRoute = registerDeleteRoute;

var _configSchema = require("@kbn/config-schema");

var _index = require("../index");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const bodySchema = _configSchema.schema.object({
  templates: _configSchema.schema.arrayOf(_configSchema.schema.object({
    name: _configSchema.schema.string(),
    isLegacy: _configSchema.schema.maybe(_configSchema.schema.boolean())
  }))
});

function registerDeleteRoute({
  router,
  lib: {
    handleEsError
  }
}) {
  router.post({
    path: (0, _index.addBasePath)('/delete_index_templates'),
    validate: {
      body: bodySchema
    }
  }, async (context, request, response) => {
    const {
      client
    } = context.core.elasticsearch;
    const {
      templates
    } = request.body;
    const responseBody = {
      templatesDeleted: [],
      errors: []
    };
    await Promise.all(templates.map(async ({
      name,
      isLegacy
    }) => {
      try {
        if (isLegacy) {
          await client.asCurrentUser.indices.deleteTemplate({
            name
          });
        } else {
          await client.asCurrentUser.indices.deleteIndexTemplate({
            name
          });
        }

        return responseBody.templatesDeleted.push(name);
      } catch (error) {
        return responseBody.errors.push({
          name,
          error: handleEsError({
            error,
            response
          })
        });
      }
    }));
    return response.ok({
      body: responseBody
    });
  });
}