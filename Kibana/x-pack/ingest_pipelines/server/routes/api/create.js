"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerCreateRoute = void 0;

var _i18n = require("@kbn/i18n");

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
  name: _configSchema.schema.string(),
  ..._shared.pipelineSchema
});

const registerCreateRoute = ({
  router,
  lib: {
    handleEsError
  }
}) => {
  router.post({
    path: _constants.API_BASE_PATH,
    validate: {
      body: bodySchema
    }
  }, async (ctx, req, res) => {
    const {
      client: clusterClient
    } = ctx.core.elasticsearch;
    const pipeline = req.body; // eslint-disable-next-line @typescript-eslint/naming-convention

    const {
      name,
      description,
      processors,
      version,
      on_failure
    } = pipeline;

    try {
      // Check that a pipeline with the same name doesn't already exist
      const {
        body: pipelineByName
      } = await clusterClient.asCurrentUser.ingest.getPipeline({
        id: name
      });

      if (pipelineByName[name]) {
        return res.conflict({
          body: new Error(_i18n.i18n.translate('xpack.ingestPipelines.createRoute.duplicatePipelineIdErrorMessage', {
            defaultMessage: "There is already a pipeline with name '{name}'.",
            values: {
              name
            }
          }))
        });
      }
    } catch (e) {// Silently swallow error
    }

    try {
      const {
        body: response
      } = await clusterClient.asCurrentUser.ingest.putPipeline({
        id: name,
        body: {
          description,
          processors,
          version,
          on_failure
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

exports.registerCreateRoute = registerCreateRoute;