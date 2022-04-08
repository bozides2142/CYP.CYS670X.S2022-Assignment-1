"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.kibanaInstancesRoute = kibanaInstancesRoute;

var _configSchema = require("@kbn/config-schema");

var _get_kibana_cluster_status = require("./_get_kibana_cluster_status");

var _get_kibanas = require("../../../../lib/kibana/get_kibanas");

var _errors = require("../../../../lib/errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function kibanaInstancesRoute(server) {
  /**
   * Kibana listing (instances)
   */
  server.route({
    method: 'POST',
    path: '/api/monitoring/v1/clusters/{clusterUuid}/kibana/instances',
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

    async handler(req) {
      const clusterUuid = req.params.clusterUuid;

      try {
        const [clusterStatus, kibanas] = await Promise.all([(0, _get_kibana_cluster_status.getKibanaClusterStatus)(req, {
          clusterUuid
        }), (0, _get_kibanas.getKibanas)(req, {
          clusterUuid
        })]);
        return {
          clusterStatus,
          kibanas
        };
      } catch (err) {
        throw (0, _errors.handleError)(err, req);
      }
    }

  });
}