"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerBootstrapRoute = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const registerBootstrapRoute = ({
  router,
  renderer
}) => {
  router.get({
    path: '/bootstrap.js',
    options: {
      authRequired: 'optional',
      tags: ['api']
    },
    validate: false
  }, async (ctx, req, res) => {
    const uiSettingsClient = ctx.core.uiSettings.client;
    const {
      body,
      etag
    } = await renderer({
      uiSettingsClient,
      request: req
    });
    return res.ok({
      body,
      headers: {
        etag,
        'content-type': 'application/javascript',
        'cache-control': 'must-revalidate'
      }
    });
  });
};

exports.registerBootstrapRoute = registerBootstrapRoute;