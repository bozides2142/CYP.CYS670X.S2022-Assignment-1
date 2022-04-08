"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logstashOverviewRoute = logstashOverviewRoute;

var _configSchema = require("@kbn/config-schema");

var _get_cluster_status = require("../../../../lib/logstash/get_cluster_status");

var _get_metrics = require("../../../../lib/details/get_metrics");

var _errors = require("../../../../lib/errors");

var _metric_set_overview = require("./metric_set_overview");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 * Logstash Overview route.
 */


function logstashOverviewRoute(server) {
  /**
   * Logstash Overview request.
   *
   * This will fetch all data required to display the Logstash Overview page.
   *
   * The current details returned are:
   *
   * - Logstash Cluster Status
   * - Metrics
   */
  server.route({
    method: 'POST',
    path: '/api/monitoring/v1/clusters/{clusterUuid}/logstash',
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
        const moduleType = 'logstash';
        const dsDataset = 'node_stats';
        const [metrics, clusterStatus] = await Promise.all([(0, _get_metrics.getMetrics)(req, moduleType, _metric_set_overview.metricSet, [{
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
                type: 'logstash_stats'
              }
            }]
          }
        }]), (0, _get_cluster_status.getClusterStatus)(req, {
          clusterUuid
        })]);
        return {
          metrics,
          clusterStatus
        };
      } catch (err) {
        throw (0, _errors.handleError)(err, req);
      }
    }

  });
}