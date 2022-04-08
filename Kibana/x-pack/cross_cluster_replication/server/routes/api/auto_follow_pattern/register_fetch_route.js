"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerFetchRoute = void 0;

var _auto_follow_pattern_serialization = require("../../../../common/services/auto_follow_pattern_serialization");

var _services = require("../../../services");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Get a list of all auto-follow patterns
 */


const registerFetchRoute = ({
  router,
  license,
  lib: {
    handleEsError
  }
}) => {
  router.get({
    path: (0, _services.addBasePath)('/auto_follow_patterns'),
    validate: false
  }, license.guardApiRoute(async (context, request, response) => {
    const {
      client
    } = context.core.elasticsearch;

    try {
      const {
        body: {
          patterns
        }
      } = await client.asCurrentUser.ccr.getAutoFollowPattern();
      return response.ok({
        body: {
          // @ts-expect-error Once #98266 is merged, test this again.
          patterns: (0, _auto_follow_pattern_serialization.deserializeListAutoFollowPatterns)(patterns)
        }
      });
    } catch (error) {
      return handleEsError({
        error,
        response
      });
    }
  }));
};

exports.registerFetchRoute = registerFetchRoute;