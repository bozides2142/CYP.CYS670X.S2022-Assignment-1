"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerSimulateRoute = registerSimulateRoute;

var _configSchema = require("@kbn/config-schema");

var _index = require("../index");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const bodySchema = _configSchema.schema.object({}, {
  unknowns: 'allow'
});

function registerSimulateRoute({
  router,
  lib: {
    handleEsError
  }
}) {
  router.post({
    path: (0, _index.addBasePath)('/index_templates/simulate'),
    validate: {
      body: bodySchema
    }
  }, async (context, request, response) => {
    const {
      client
    } = context.core.elasticsearch;
    const template = request.body;

    try {
      const {
        body: templatePreview
      } = await client.asCurrentUser.indices.simulateTemplate({
        body: { ...template,
          // Until ES fixes a bug on their side we need to send a fake index pattern
          // that won't match any indices.
          // Issue: https://github.com/elastic/elasticsearch/issues/59152
          index_patterns: ['a_fake_index_pattern_that_wont_match_any_indices']
        }
      });
      return response.ok({
        body: templatePreview
      });
    } catch (error) {
      return handleEsError({
        error,
        response
      });
    }
  });
}