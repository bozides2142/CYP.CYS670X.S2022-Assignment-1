"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerGetRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _follower_index_serialization = require("../../../../common/services/follower_index_serialization");

var _services = require("../../../services");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Returns a single follower index pattern
 */


const registerGetRoute = ({
  router,
  license,
  lib: {
    handleEsError
  }
}) => {
  const paramsSchema = _configSchema.schema.object({
    id: _configSchema.schema.string()
  });

  router.get({
    path: (0, _services.addBasePath)('/follower_indices/{id}'),
    validate: {
      params: paramsSchema
    }
  }, license.guardApiRoute(async (context, request, response) => {
    const {
      client
    } = context.core.elasticsearch;
    const {
      id
    } = request.params;

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
      } // If this follower is paused, skip call to ES stats api since it will return 404


      if (followerIndexInfo.status === 'paused') {
        return response.ok({
          // @ts-expect-error Once #98266 is merged, test this again.
          body: (0, _follower_index_serialization.deserializeFollowerIndex)({ ...followerIndexInfo
          })
        });
      } else {
        const {
          body: {
            indices: followerIndicesStats
          }
        } = await client.asCurrentUser.ccr.followStats({
          index: id
        });
        return response.ok({
          // @ts-expect-error Once #98266 is merged, test this again.
          body: (0, _follower_index_serialization.deserializeFollowerIndex)({ ...followerIndexInfo,
            ...(followerIndicesStats ? followerIndicesStats[0] : {})
          })
        });
      }
    } catch (error) {
      return handleEsError({
        error,
        response
      });
    }
  }));
};

exports.registerGetRoute = registerGetRoute;