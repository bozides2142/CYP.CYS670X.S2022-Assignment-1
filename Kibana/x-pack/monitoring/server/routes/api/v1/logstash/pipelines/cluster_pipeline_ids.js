"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logstashClusterPipelineIdsRoute = logstashClusterPipelineIdsRoute;

var _configSchema = require("@kbn/config-schema");

var _errors = require("../../../../../lib/errors");

var _get_pipeline_ids = require("../../../../../lib/logstash/get_pipeline_ids");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Retrieve pipelines for a cluster
 */


function logstashClusterPipelineIdsRoute(server) {
  server.route({
    method: 'POST',
    path: '/api/monitoring/v1/clusters/{clusterUuid}/logstash/pipeline_ids',
    config: {
      validate: {
        params: _configSchema.schema.object({
          clusterUuid: _configSchema.schema.string()
        }),
        payload: _configSchema.schema.object({
          ccs: _configSchema.schema.maybe(_configSchema.schema.string()),
          timeRange: _configSchema.schema.object({
            min: _configSchema.schema.string(),
            max: _configSchema.schema.string()
          })
        })
      }
    },
    handler: async req => {
      const config = server.config;
      const clusterUuid = req.params.clusterUuid;
      const size = config.ui.max_bucket_size;

      try {
        return await (0, _get_pipeline_ids.getLogstashPipelineIds)({
          req,
          clusterUuid,
          size
        });
      } catch (err) {
        throw (0, _errors.handleError)(err, req);
      }
    }
  });
}