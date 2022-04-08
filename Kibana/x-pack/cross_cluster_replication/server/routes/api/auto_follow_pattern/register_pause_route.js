"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerPauseRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _services = require("../../../services");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Pause auto-follow pattern(s)
 */


const registerPauseRoute = ({
  router,
  license,
  lib: {
    handleEsError
  }
}) => {
  const paramsSchema = _configSchema.schema.object({
    id: _configSchema.schema.string()
  });

  router.post({
    path: (0, _services.addBasePath)('/auto_follow_patterns/{id}/pause'),
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
    const ids = id.split(',');
    const itemsPaused = [];
    const errors = [];
    await Promise.all(ids.map(_id => client.asCurrentUser.ccr.pauseAutoFollowPattern({
      name: _id
    }).then(() => itemsPaused.push(_id)).catch(error => {
      errors.push({
        id: _id,
        error: handleEsError({
          error,
          response
        })
      });
    })));
    return response.ok({
      body: {
        itemsPaused,
        errors
      }
    });
  }));
};

exports.registerPauseRoute = registerPauseRoute;