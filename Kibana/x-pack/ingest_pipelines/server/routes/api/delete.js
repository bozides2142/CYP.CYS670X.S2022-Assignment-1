"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerDeleteRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _constants = require("../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const paramsSchema = _configSchema.schema.object({
  names: _configSchema.schema.string()
});

const registerDeleteRoute = ({
  router
}) => {
  router.delete({
    path: `${_constants.API_BASE_PATH}/{names}`,
    validate: {
      params: paramsSchema
    }
  }, async (ctx, req, res) => {
    const {
      client: clusterClient
    } = ctx.core.elasticsearch;
    const {
      names
    } = req.params;
    const pipelineNames = names.split(',');
    const response = {
      itemsDeleted: [],
      errors: []
    };
    await Promise.all(pipelineNames.map(pipelineName => {
      return clusterClient.asCurrentUser.ingest.deletePipeline({
        id: pipelineName
      }).then(() => response.itemsDeleted.push(pipelineName)).catch(e => {
        var _e$meta$body$error, _e$meta, _e$meta$body, _e$meta2, _e$meta2$body;

        response.errors.push({
          error: (_e$meta$body$error = e === null || e === void 0 ? void 0 : (_e$meta = e.meta) === null || _e$meta === void 0 ? void 0 : (_e$meta$body = _e$meta.body) === null || _e$meta$body === void 0 ? void 0 : _e$meta$body.error) !== null && _e$meta$body$error !== void 0 ? _e$meta$body$error : e,
          status: e === null || e === void 0 ? void 0 : (_e$meta2 = e.meta) === null || _e$meta2 === void 0 ? void 0 : (_e$meta2$body = _e$meta2.body) === null || _e$meta2$body === void 0 ? void 0 : _e$meta2$body.status,
          name: pipelineName
        });
      });
    }));
    return res.ok({
      body: response
    });
  });
};

exports.registerDeleteRoute = registerDeleteRoute;