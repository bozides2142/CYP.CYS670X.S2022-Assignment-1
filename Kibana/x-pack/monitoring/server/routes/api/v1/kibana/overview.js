"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.kibanaOverviewRoute = kibanaOverviewRoute;

var _configSchema = require("@kbn/config-schema");

var _get_kibana_cluster_status = require("./_get_kibana_cluster_status");

var _get_metrics = require("../../../../lib/details/get_metrics");

var _metric_set_overview = require("./metric_set_overview");

var _errors = require("../../../../lib/errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function kibanaOverviewRoute(server) {
  /**
   * Kibana overview (metrics)
   */
  server.route({
    method: 'POST',
    path: '/api/monitoring/v1/clusters/{clusterUuid}/kibana',
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
        const moduleType = 'kibana';
        const dsDataset = 'stats';
        const [clusterStatus, metrics] = await Promise.all([(0, _get_kibana_cluster_status.getKibanaClusterStatus)(req, {
          clusterUuid
        }), (0, _get_metrics.getMetrics)(req, moduleType, _metric_set_overview.metricSet, [{
          bool: {
            should: [{
              term: {
                'data_stream.dataset': `${moduleType}.${dsDataset}`
              }
            }, {
              term: {
                'metricset.name': dsDataset
              }
            }, {
              term: {
                type: 'kibana_stats'
              }
            }]
          }
        }])]);
        return {
          clusterStatus,
          metrics
        };
      } catch (err) {
        throw (0, _errors.handleError)(err, req);
      }
    }

  });
}