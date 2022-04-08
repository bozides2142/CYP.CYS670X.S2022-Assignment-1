"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerStatsRoute = void 0;

var _services = require("../../../services");

var _ccr_stats_serialization = require("../../../lib/ccr_stats_serialization");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Returns Auto-follow stats
 */


const registerStatsRoute = ({
  router,
  license,
  lib: {
    handleEsError
  }
}) => {
  router.get({
    path: (0, _services.addBasePath)('/stats/auto_follow'),
    validate: false
  }, license.guardApiRoute(async (context, request, response) => {
    const {
      client
    } = context.core.elasticsearch;

    try {
      const {
        body: {
          auto_follow_stats: autoFollowStats
        }
      } = await client.asCurrentUser.ccr.stats();
      return response.ok({
        // @ts-expect-error Once #98266 is merged, test this again.
        body: (0, _ccr_stats_serialization.deserializeAutoFollowStats)(autoFollowStats)
      });
    } catch (error) {
      return handleEsError({
        error,
        response
      });
    }
  }));
};

exports.registerStatsRoute = registerStatsRoute;