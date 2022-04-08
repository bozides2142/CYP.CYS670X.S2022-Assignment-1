"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerGotoRoute = void 0;

var _configSchema = require("@kbn/config-schema");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * This endpoint maintains the legacy /goto/<short_url_id> route. It loads the
 * /app/goto/<short_url_id> app which handles the redirection.
 */
const registerGotoRoute = (router, core) => {
  core.http.resources.register({
    path: '/goto/{id}',
    validate: {
      params: _configSchema.schema.object({
        id: _configSchema.schema.string({
          minLength: 4,
          maxLength: 128
        })
      })
    }
  }, router.handleLegacyErrors(async (ctx, req, res) => {
    return res.renderCoreApp();
  }));
};

exports.registerGotoRoute = registerGotoRoute;