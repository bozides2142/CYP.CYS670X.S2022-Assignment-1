"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerStartRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _services = require("../../../services");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const registerStartRoute = ({
  router,
  license,
  lib: {
    handleEsError
  }
}) => {
  router.post({
    path: (0, _services.addBasePath)('/start'),
    validate: {
      body: _configSchema.schema.object({
        jobIds: _configSchema.schema.arrayOf(_configSchema.schema.string())
      }),
      query: _configSchema.schema.maybe(_configSchema.schema.object({
        waitForCompletion: _configSchema.schema.maybe(_configSchema.schema.string())
      }))
    }
  }, license.guardApiRoute(async (context, request, response) => {
    const {
      client: clusterClient
    } = context.core.elasticsearch;

    try {
      const {
        jobIds
      } = request.body;
      const data = await Promise.all(jobIds.map(id => clusterClient.asCurrentUser.rollup.startJob({
        id
      }))).then(() => ({
        success: true
      }));
      return response.ok({
        body: data
      });
    } catch (err) {
      return handleEsError({
        error: err,
        response
      });
    }
  }));
};

exports.registerStartRoute = registerStartRoute;