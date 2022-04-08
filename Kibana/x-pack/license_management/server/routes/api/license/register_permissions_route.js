"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerPermissionsRoute = registerPermissionsRoute;

var _permissions = require("../../../lib/permissions");

var _helpers = require("../../helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerPermissionsRoute({
  router,
  lib: {
    handleEsError
  },
  config: {
    isSecurityEnabled
  }
}) {
  router.post({
    path: (0, _helpers.addBasePath)('/permissions'),
    validate: false
  }, async (ctx, req, res) => {
    const {
      client
    } = ctx.core.elasticsearch;

    try {
      return res.ok({
        body: await (0, _permissions.getPermissions)({
          client,
          isSecurityEnabled
        })
      });
    } catch (error) {
      return handleEsError({
        error,
        response: res
      });
    }
  });
}