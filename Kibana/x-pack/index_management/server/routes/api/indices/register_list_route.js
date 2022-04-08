"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerListRoute = registerListRoute;

var _fetch_indices = require("../../../lib/fetch_indices");

var _index = require("../index");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerListRoute({
  router,
  indexDataEnricher,
  lib: {
    handleEsError
  }
}) {
  router.get({
    path: (0, _index.addBasePath)('/indices'),
    validate: false
  }, async (context, request, response) => {
    const {
      client
    } = context.core.elasticsearch;

    try {
      const indices = await (0, _fetch_indices.fetchIndices)(client, indexDataEnricher);
      return response.ok({
        body: indices
      });
    } catch (error) {
      return handleEsError({
        error,
        response
      });
    }
  });
}