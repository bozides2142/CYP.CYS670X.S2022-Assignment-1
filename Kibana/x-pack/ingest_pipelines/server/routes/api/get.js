"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerGetRoutes = void 0;

var _configSchema = require("@kbn/config-schema");

var _lib = require("../../../common/lib");

var _constants = require("../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const paramsSchema = _configSchema.schema.object({
  name: _configSchema.schema.string()
});

const registerGetRoutes = ({
  router,
  lib: {
    handleEsError
  }
}) => {
  // Get all pipelines
  router.get({
    path: _constants.API_BASE_PATH,
    validate: false
  }, async (ctx, req, res) => {
    const {
      client: clusterClient
    } = ctx.core.elasticsearch;

    try {
      const {
        body: pipelines
      } = await clusterClient.asCurrentUser.ingest.getPipeline();
      return res.ok({
        body: (0, _lib.deserializePipelines)(pipelines)
      });
    } catch (error) {
      const esErrorResponse = handleEsError({
        error,
        response: res
      });

      if (esErrorResponse.status === 404) {
        // ES returns 404 when there are no pipelines
        // Instead, we return an empty array and 200 status back to the client
        return res.ok({
          body: []
        });
      }

      return esErrorResponse;
    }
  }); // Get single pipeline

  router.get({
    path: `${_constants.API_BASE_PATH}/{name}`,
    validate: {
      params: paramsSchema
    }
  }, async (ctx, req, res) => {
    const {
      client: clusterClient
    } = ctx.core.elasticsearch;
    const {
      name
    } = req.params;

    try {
      const {
        body: pipelines
      } = await clusterClient.asCurrentUser.ingest.getPipeline({
        id: name
      });
      return res.ok({
        body: { ...pipelines[name],
          name
        }
      });
    } catch (error) {
      return handleEsError({
        error,
        response: res
      });
    }
  });
};

exports.registerGetRoutes = registerGetRoutes;