"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerUpdateRoute = registerUpdateRoute;

var _configSchema = require("@kbn/config-schema");

var _index = require("../index");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const bodySchema = _configSchema.schema.any();

const paramsSchema = _configSchema.schema.object({
  indexName: _configSchema.schema.string()
});

function registerUpdateRoute({
  router,
  lib: {
    handleEsError
  }
}) {
  router.put({
    path: (0, _index.addBasePath)('/settings/{indexName}'),
    validate: {
      body: bodySchema,
      params: paramsSchema
    }
  }, async (context, request, response) => {
    const {
      client
    } = context.core.elasticsearch;
    const {
      indexName
    } = request.params;
    const params = {
      ignore_unavailable: true,
      allow_no_indices: false,
      expand_wildcards: 'none',
      index: indexName,
      body: request.body
    };

    try {
      const {
        body: responseBody
      } = await client.asCurrentUser.indices.putSettings(params);
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