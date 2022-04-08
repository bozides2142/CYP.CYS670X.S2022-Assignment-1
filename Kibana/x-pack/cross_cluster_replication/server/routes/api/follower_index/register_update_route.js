"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerUpdateRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _follower_index_serialization = require("../../../../common/services/follower_index_serialization");

var _utils = require("../../../../common/services/utils");

var _services = require("../../../services");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Update a follower index
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
    maxReadRequestOperationCount: _configSchema.schema.maybe(_configSchema.schema.number()),
    maxOutstandingReadRequests: _configSchema.schema.maybe(_configSchema.schema.number()),
    maxReadRequestSize: _configSchema.schema.maybe(_configSchema.schema.string()),
    // byte value
    maxWriteRequestOperationCount: _configSchema.schema.maybe(_configSchema.schema.number()),
    maxWriteRequestSize: _configSchema.schema.maybe(_configSchema.schema.string()),
    // byte value
    maxOutstandingWriteRequests: _configSchema.schema.maybe(_configSchema.schema.number()),
    maxWriteBufferCount: _configSchema.schema.maybe(_configSchema.schema.number()),
    maxWriteBufferSize: _configSchema.schema.maybe(_configSchema.schema.string()),
    // byte value
    maxRetryDelay: _configSchema.schema.maybe(_configSchema.schema.string()),
    // time value
    readPollTimeout: _configSchema.schema.maybe(_configSchema.schema.string()) // time value

  });

  router.put({
    path: (0, _services.addBasePath)('/follower_indices/{id}'),
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
    } = request.params; // We need to first pause the follower and then resume it by passing the advanced settings

    try {
      const {
        body: {
          follower_indices: followerIndices
        }
      } = await client.asCurrentUser.ccr.followInfo({
        index: id
      });
      const followerIndexInfo = followerIndices && followerIndices[0];

      if (!followerIndexInfo) {
        return response.notFound({
          body: `The follower index "${id}" does not exist.`
        });
      } // Retrieve paused state instead of pulling it from the payload to ensure it's not stale.


      const isPaused = followerIndexInfo.status === 'paused'; // Pause follower if not already paused

      if (!isPaused) {
        await client.asCurrentUser.ccr.pauseFollow({
          index: id
        });
      } // Resume follower


      const body = (0, _utils.removeEmptyFields)((0, _follower_index_serialization.serializeAdvancedSettings)(request.body));
      const {
        body: responseBody
      } = await client.asCurrentUser.ccr.resumeFollow({
        index: id,
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