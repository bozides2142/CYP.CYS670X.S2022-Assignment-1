"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerGetRoute = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const registerGetRoute = router => {
  router.get({
    path: '/',
    validate: false
  }, async (context, req, res) => {
    const deprecationsClient = context.core.deprecations.client;
    const body = {
      deprecations: await deprecationsClient.getAllDeprecations()
    };
    return res.ok({
      body
    });
  });
};

exports.registerGetRoute = registerGetRoute;