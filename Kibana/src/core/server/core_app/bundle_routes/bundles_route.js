"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerRouteForBundle = registerRouteForBundle;

var _configSchema = require("@kbn/config-schema");

var _dynamic_asset_response = require("./dynamic_asset_response");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function registerRouteForBundle(router, {
  publicPath,
  routePath,
  bundlesPath,
  fileHashCache,
  isDist
}) {
  router.get({
    path: `${routePath}{path*}`,
    options: {
      authRequired: false
    },
    validate: {
      params: _configSchema.schema.object({
        path: _configSchema.schema.string()
      })
    }
  }, (0, _dynamic_asset_response.createDynamicAssetHandler)({
    publicPath,
    bundlesPath,
    isDist,
    fileHashCache
  }));
}