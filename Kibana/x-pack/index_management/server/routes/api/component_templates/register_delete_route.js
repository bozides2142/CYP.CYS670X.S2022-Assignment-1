"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerDeleteRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _index = require("../index");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const paramsSchema = _configSchema.schema.object({
  names: _configSchema.schema.string()
});

const registerDeleteRoute = ({
  router,
  lib: {
    handleEsError
  }
}) => {
  router.delete({
    path: (0, _index.addBasePath)('/component_templates/{names}'),
    validate: {
      params: paramsSchema
    }
  }, async (context, request, response) => {
    const {
      client
    } = context.core.elasticsearch;
    const {
      names
    } = request.params;
    const componentNames = names.split(',');
    const responseBody = {
      itemsDeleted: [],
      errors: []
    };
    await Promise.all(componentNames.map(async componentName => {
      try {
        await client.asCurrentUser.cluster.deleteComponentTemplate({
          name: componentName
        });
        return responseBody.itemsDeleted.push(componentName);
      } catch (error) {
        return responseBody.errors.push({
          name: componentName,
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
};

exports.registerDeleteRoute = registerDeleteRoute;