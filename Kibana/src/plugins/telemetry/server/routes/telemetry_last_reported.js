"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerTelemetryLastReported = registerTelemetryLastReported;

var _operators = require("rxjs/operators");

var _telemetry_repository = require("../telemetry_repository");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function registerTelemetryLastReported(router, savedObjectsInternalClient$) {
  // GET to retrieve
  router.get({
    path: '/api/telemetry/v2/last_reported',
    validate: false
  }, async (context, req, res) => {
    const savedObjectsInternalClient = await savedObjectsInternalClient$.pipe((0, _operators.take)(1)).toPromise();
    const telemetrySavedObject = await (0, _telemetry_repository.getTelemetrySavedObject)(savedObjectsInternalClient);
    return res.ok({
      body: {
        lastReported: telemetrySavedObject && (telemetrySavedObject === null || telemetrySavedObject === void 0 ? void 0 : telemetrySavedObject.lastReported)
      }
    });
  }); // PUT to update

  router.put({
    path: '/api/telemetry/v2/last_reported',
    validate: false
  }, async (context, req, res) => {
    const savedObjectsInternalClient = await savedObjectsInternalClient$.pipe((0, _operators.take)(1)).toPromise();
    await (0, _telemetry_repository.updateTelemetrySavedObject)(savedObjectsInternalClient, {
      lastReported: Date.now()
    });
    return res.ok();
  });
}