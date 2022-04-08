"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerOpenRoute = registerOpenRoute;

var _configSchema = require("@kbn/config-schema");

var _index = require("../index");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const bodySchema = _configSchema.schema.object({
  indices: _configSchema.schema.arrayOf(_configSchema.schema.string())
});

function registerOpenRoute({
  router,
  lib: {
    handleEsError
  }
}) {
  router.post({
    path: (0, _index.addBasePath)('/indices/open'),
    validate: {
      body: bodySchema
    }
  }, async (context, request, response) => {
    const {
      client
    } = context.core.elasticsearch;
    const {
      indices = []
    } = request.body;
    const params = {
      expand_wildcards: 'none',
      format: 'json',
      index: indices
    };

    try {
      await client.asCurrentUser.indices.open(params);
      return response.ok();
    } catch (error) {
      return handleEsError({
        error,
        response
      });
    }
  });
}