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
  dataStreams: _configSchema.schema.arrayOf(_configSchema.schema.string())
});

function registerDeleteRoute({
  router,
  lib: {
    handleEsError
  }
}) {
  router.post({
    path: (0, _index.addBasePath)('/delete_data_streams'),
    validate: {
      body: bodySchema
    }
  }, async (context, request, response) => {
    const {
      client
    } = context.core.elasticsearch;
    const {
      dataStreams
    } = request.body;
    const responseBody = {
      dataStreamsDeleted: [],
      errors: []
    };
    await Promise.all(dataStreams.map(async name => {
      try {
        await client.asCurrentUser.indices.deleteDataStream({
          name
        });
        return responseBody.dataStreamsDeleted.push(name);
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