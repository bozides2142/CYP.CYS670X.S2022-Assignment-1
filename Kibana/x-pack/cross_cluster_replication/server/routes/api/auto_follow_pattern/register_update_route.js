"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerUpdateRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _auto_follow_pattern_serialization = require("../../../../common/services/auto_follow_pattern_serialization");

var _services = require("../../../services");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Update an auto-follow pattern
 */


const registerUpdateRoute = ({
  router,
  license,
  lib: {
    handleEsError
  }
}) => {
  const paramsSchema = _configSchema.schema.object({
    id: _configSchema.schema.string()
  });

  const bodySchema = _configSchema.schema.object({
    active: _configSchema.schema.boolean(),
    remoteCluster: _configSchema.schema.string(),
    leaderIndexPatterns: _configSchema.schema.arrayOf(_configSchema.schema.string()),
    followIndexPattern: _configSchema.schema.string()
  });

  router.put({
    path: (0, _services.addBasePath)('/auto_follow_patterns/{id}'),
    validate: {
      params: paramsSchema,
      body: bodySchema
    }
  }, license.guardApiRoute(async (context, request, response) => {
    const {
      client
    } = context.core.elasticsearch;
    const {
      id
    } = request.params;
    const body = (0, _auto_follow_pattern_serialization.serializeAutoFollowPattern)(request.body);

    try {
      const {
        body: responseBody
      } = await client.asCurrentUser.ccr.putAutoFollowPattern({
        name: id,
        body
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
  }));
};

exports.registerUpdateRoute = registerUpdateRoute;