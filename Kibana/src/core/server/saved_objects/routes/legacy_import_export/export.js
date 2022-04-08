"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerLegacyExportRoute = void 0;

var _moment = _interopRequireDefault(require("moment"));

var _configSchema = require("@kbn/config-schema");

var _lib = require("./lib");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const registerLegacyExportRoute = (router, {
  kibanaVersion,
  coreUsageData,
  logger
}) => {
  router.get({
    path: '/api/kibana/dashboards/export',
    validate: {
      query: _configSchema.schema.object({
        dashboard: _configSchema.schema.oneOf([_configSchema.schema.string(), _configSchema.schema.arrayOf(_configSchema.schema.string())])
      })
    },
    options: {
      tags: ['api']
    }
  }, async (ctx, req, res) => {
    logger.warn("The export dashboard API '/api/kibana/dashboards/export' is deprecated. Use the saved objects export objects API '/api/saved_objects/_export' instead.");
    const ids = Array.isArray(req.query.dashboard) ? req.query.dashboard : [req.query.dashboard];
    const {
      client
    } = ctx.core.savedObjects;
    const usageStatsClient = coreUsageData.getClient();
    usageStatsClient.incrementLegacyDashboardsExport({
      request: req
    }).catch(() => {});
    const exported = await (0, _lib.exportDashboards)(ids, client, kibanaVersion);
    const filename = `kibana-dashboards.${_moment.default.utc().format('YYYY-MM-DD-HH-mm-ss')}.json`;
    const body = JSON.stringify(exported, null, '  ');
    return res.ok({
      body,
      headers: {
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Type': 'application/json',
        'Content-Length': `${Buffer.byteLength(body, 'utf8')}`
      }
    });
  });
};

exports.registerLegacyExportRoute = registerLegacyExportRoute;