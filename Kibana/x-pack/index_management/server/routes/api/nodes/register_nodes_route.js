"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerNodesRoute = registerNodesRoute;

var _index = require("../index");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerNodesRoute({
  router,
  lib: {
    handleEsError
  }
}) {
  // Retrieve the es plugins installed on the cluster nodes
  router.get({
    path: (0, _index.addBasePath)('/nodes/plugins'),
    validate: {}
  }, async (context, request, response) => {
    const {
      client
    } = context.core.elasticsearch;

    try {
      const {
        body
      } = await client.asCurrentUser.nodes.info();
      const plugins = Object.values(body.nodes).reduce((acc, nodeInfo) => {
        var _nodeInfo$plugins;

        (_nodeInfo$plugins = nodeInfo.plugins) === null || _nodeInfo$plugins === void 0 ? void 0 : _nodeInfo$plugins.forEach(({
          name
        }) => {
          acc.add(name);
        });
        return acc;
      }, new Set());
      return response.ok({
        body: Array.from(plugins)
      });
    } catch (error) {
      return handleEsError({
        error,
        response
      });
    }
  });
}