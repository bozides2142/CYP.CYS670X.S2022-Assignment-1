"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerLoadRoute = registerLoadRoute;

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
}); // response comes back as { [indexName]: { ... }}
// so plucking out the embedded object


function formatHit(hit) {
  const key = Object.keys(hit)[0];
  return hit[key];
}

function registerLoadRoute({
  router,
  lib: {
    handleEsError
  }
}) {
  router.get({
    path: (0, _index.addBasePath)('/settings/{indexName}'),
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
      flat_settings: false,
      local: false,
      include_defaults: true,
      index: indexName
    };

    try {
      const {
        body: hit
      } = await client.asCurrentUser.indices.getSettings(params);
      return response.ok({
        body: formatHit(hit)
      });
    } catch (error) {
      return handleEsError({
        error,
        response
      });
    }
  });
}