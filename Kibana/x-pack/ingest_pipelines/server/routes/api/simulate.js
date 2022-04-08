"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerSimulateRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _constants = require("../../../common/constants");

var _shared = require("./shared");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const bodySchema = _configSchema.schema.object({
  pipeline: _configSchema.schema.object(_shared.pipelineSchema),
  documents: _configSchema.schema.arrayOf(_configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.any())),
  verbose: _configSchema.schema.maybe(_configSchema.schema.boolean())
});

const registerSimulateRoute = ({
  router,
  lib: {
    handleEsError
  }
}) => {
  router.post({
    path: `${_constants.API_BASE_PATH}/simulate`,
    validate: {
      body: bodySchema
    }
  }, async (ctx, req, res) => {
    const {
      client: clusterClient
    } = ctx.core.elasticsearch;
    const {
      pipeline,
      documents,
      verbose
    } = req.body;

    try {
      const {
        body: response
      } = await clusterClient.asCurrentUser.ingest.simulate({
        verbose,
        body: {
          pipeline,
          docs: documents
        }
      });
      return res.ok({
        body: response
      });
    } catch (error) {
      return handleEsError({
        error,
        response: res
      });
    }
  });
};

exports.registerSimulateRoute = registerSimulateRoute;