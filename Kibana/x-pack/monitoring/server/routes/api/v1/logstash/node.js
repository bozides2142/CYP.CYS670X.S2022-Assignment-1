"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logstashNodeRoute = logstashNodeRoute;

var _configSchema = require("@kbn/config-schema");

var _get_node_info = require("../../../../lib/logstash/get_node_info");

var _errors = require("../../../../lib/errors");

var _get_metrics = require("../../../../lib/details/get_metrics");

var _metric_set_node = require("./metric_set_node");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const {
  advanced: metricSetAdvanced,
  overview: metricSetOverview
} = _metric_set_node.metricSets;
/*
 * Logstash Node route.
 */

function logstashNodeRoute(server) {
  /**
   * Logstash Node request.
   *
   * This will fetch all data required to display a Logstash Node page.
   *
   * The current details returned are:
   *
   * - Logstash Node Summary (Status)
   * - Metrics
   */
  server.route({
    method: 'POST',
    path: '/api/monitoring/v1/clusters/{clusterUuid}/logstash/node/{logstashUuid}',
    config: {
      validate: {
        params: _configSchema.schema.object({
          clusterUuid: _configSchema.schema.string(),
          logstashUuid: _configSchema.schema.string()
        }),
        payload: _configSchema.schema.object({
          ccs: _configSchema.schema.maybe(_configSchema.schema.string()),
          timeRange: _configSchema.schema.object({
            min: _configSchema.schema.string(),
            max: _configSchema.schema.string()
          }),
          is_advanced: _configSchema.schema.boolean()
        })
      }
    },

    async handler(req) {
      const config = server.config;
      const clusterUuid = req.params.clusterUuid;
      const logstashUuid = req.params.logstashUuid;
      let metricSet;

      if (req.payload.is_advanced) {
        metricSet = metricSetAdvanced;
      } else {
        metricSet = metricSetOverview; // set the cgroup option if needed

        const showCgroupMetricsLogstash = config.ui.container.logstash.enabled;
        const metricCpu = metricSet.find(m => m.name === 'logstash_node_cpu_metric');

        if (showCgroupMetricsLogstash) {
          metricCpu.keys = ['logstash_node_cgroup_quota_as_cpu_utilization'];
        } else {
          metricCpu.keys = ['logstash_node_cpu_utilization'];
        }
      }

      try {
        const moduleType = 'logstash';
        const dsDataset = 'node_stats';
        const [metrics, nodeSummary] = await Promise.all([(0, _get_metrics.getMetrics)(req, 'logstash', metricSet, [{
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
        }]), (0, _get_node_info.getNodeInfo)(req, {
          clusterUuid,
          logstashUuid
        })]);
        return {
          metrics,
          nodeSummary
        };
      } catch (err) {
        throw (0, _errors.handleError)(err, req);
      }
    }

  });
}