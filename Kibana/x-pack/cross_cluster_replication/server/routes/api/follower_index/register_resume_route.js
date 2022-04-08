"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerResumeRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _services = require("../../../services");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Resumes a follower index
 */


const registerResumeRoute = ({
  router,
  license,
  lib: {
    handleEsError
  }
}) => {
  const paramsSchema = _configSchema.schema.object({
    id: _configSchema.schema.string()
  });

  router.put({
    path: (0, _services.addBasePath)('/follower_indices/{id}/resume'),
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
    const itemsResumed = [];
    const errors = [];
    await Promise.all(ids.map(_id => client.asCurrentUser.ccr.resumeFollow({
      index: _id
    }).then(() => itemsResumed.push(_id)).catch(error => {
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
        itemsResumed,
        errors
      }
    });
  }));
};

exports.registerResumeRoute = registerResumeRoute;