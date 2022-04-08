"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerDeleteRoute = void 0;

var _configSchema = require("@kbn/config-schema");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const registerDeleteRoute = (router, url) => {
  router.delete({
    path: '/api/short_url/{id}',
    validate: {
      params: _configSchema.schema.object({
        id: _configSchema.schema.string({
          minLength: 4,
          maxLength: 128
        })
      })
    }
  }, router.handleLegacyErrors(async (ctx, req, res) => {
    const id = req.params.id;
    const savedObjects = ctx.core.savedObjects.client;
    const shortUrls = url.shortUrls.get({
      savedObjects
    });
    await shortUrls.delete(id);
    return res.ok({
      headers: {
        'content-type': 'application/json'
      },
      body: 'null'
    });
  }));
};

exports.registerDeleteRoute = registerDeleteRoute;