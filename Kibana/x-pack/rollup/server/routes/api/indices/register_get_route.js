"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerGetRoute = void 0;

var _services = require("../../../services");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Returns a list of all rollup index names
 */


const registerGetRoute = ({
  router,
  license,
  lib: {
    handleEsError,
    getCapabilitiesForRollupIndices
  }
}) => {
  router.get({
    path: (0, _services.addBasePath)('/indices'),
    validate: false
  }, license.guardApiRoute(async (context, request, response) => {
    try {
      const {
        client: clusterClient
      } = context.core.elasticsearch;
      const {
        body: data
      } = await clusterClient.asCurrentUser.rollup.getRollupIndexCaps({
        index: '_all'
      });
      return response.ok({
        body: getCapabilitiesForRollupIndices(data)
      });
    } catch (err) {
      return handleEsError({
        error: err,
        response
      });
    }
  }));
};

exports.registerGetRoute = registerGetRoute;