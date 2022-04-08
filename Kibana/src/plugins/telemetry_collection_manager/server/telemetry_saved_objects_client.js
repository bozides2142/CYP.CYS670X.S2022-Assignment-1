"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TelemetrySavedObjectsClient = void 0;

var _server = require("../../../core/server");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Extends the SavedObjectsClient to fit the telemetry fetching requirements (i.e.: find objects from all namespaces by default)
 */
class TelemetrySavedObjectsClient extends _server.SavedObjectsClient {
  /**
   * Find the SavedObjects matching the search query in all the Spaces by default
   * @param options
   */
  async find(options) {
    return super.find({
      namespaces: ['*'],
      ...options
    });
  }

}

exports.TelemetrySavedObjectsClient = TelemetrySavedObjectsClient;