"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerTelemetryOptInStatsRoutes = registerTelemetryOptInStatsRoutes;
exports.sendTelemetryOptInStatus = sendTelemetryOptInStatus;

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _configSchema = require("@kbn/config-schema");

var _telemetry_config = require("../../common/telemetry_config");

var _constants = require("../../common/constants");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
async function sendTelemetryOptInStatus(telemetryCollectionManager, config, statsGetterConfig) {
  const {
    sendUsageTo,
    newOptInStatus,
    currentKibanaVersion
  } = config;
  const optInStatusUrl = (0, _telemetry_config.getTelemetryChannelEndpoint)({
    env: sendUsageTo,
    channelName: 'optInStatus'
  });
  const optInStatusPayload = await telemetryCollectionManager.getOptInStats(newOptInStatus, statsGetterConfig);
  await Promise.all(optInStatusPayload.map(async ({
    clusterUuid,
    stats
  }) => {
    return await (0, _nodeFetch.default)(optInStatusUrl, {
      method: 'post',
      body: typeof stats === 'string' ? stats : JSON.stringify(stats),
      headers: {
        'Content-Type': 'application/json',
        'X-Elastic-Stack-Version': currentKibanaVersion,
        'X-Elastic-Cluster-ID': clusterUuid,
        'X-Elastic-Content-Encoding': _constants.PAYLOAD_CONTENT_ENCODING
      }
    });
  }));
}

function registerTelemetryOptInStatsRoutes(router, telemetryCollectionManager) {
  router.post({
    path: '/api/telemetry/v2/clusters/_opt_in_stats',
    validate: {
      body: _configSchema.schema.object({
        enabled: _configSchema.schema.boolean(),
        unencrypted: _configSchema.schema.boolean({
          defaultValue: true
        })
      })
    }
  }, async (context, req, res) => {
    try {
      const newOptInStatus = req.body.enabled;
      const unencrypted = req.body.unencrypted;
      const statsGetterConfig = {
        unencrypted,
        request: req
      };
      const optInStatus = await telemetryCollectionManager.getOptInStats(newOptInStatus, statsGetterConfig);
      return res.ok({
        body: optInStatus
      });
    } catch (err) {
      return res.ok({
        body: []
      });
    }
  });
}