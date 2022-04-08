"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerMappingRoute = registerMappingRoute;

var _configSchema = require("@kbn/config-schema");

var _index = require("../index");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const paramsSchema = _configSchema.schema.object({
  indexName: _configSchema.schema.string()
});

function formatHit(hit, indexName) {
  const mappings = hit[indexName].mappings;
  return {
    mappings
  };
}

function registerMappingRoute({
  router,
  lib: {
    handleEsError
  }
}) {
  router.get({
    path: (0, _index.addBasePath)('/mapping/{indexName}'),
    validate: {
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
      expand_wildcards: 'none',
      index: indexName
    };

    try {
      const {
        body: hit
      } = await client.asCurrentUser.indices.getMapping(params);
      const responseBody = formatHit(hit, indexName);
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