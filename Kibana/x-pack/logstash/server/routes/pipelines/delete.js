"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerPipelinesDeleteRoute = registerPipelinesDeleteRoute;

var _configSchema = require("@kbn/config-schema");

var _server = require("../../../../licensing/server");

var _check_license = require("../../lib/check_license");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function deletePipelines(client, pipelineIds) {
  const deletePromises = pipelineIds.map(pipelineId => {
    return client.logstash.deletePipeline({
      id: pipelineId
    }).then(response => ({
      success: response.body
    })).catch(error => ({
      error
    }));
  });
  const results = await Promise.all(deletePromises);
  const successes = results.filter(result => Reflect.has(result, 'success'));
  const errors = results.filter(result => Reflect.has(result, 'error'));
  return {
    numSuccesses: successes.length,
    numErrors: errors.length
  };
}

function registerPipelinesDeleteRoute(router) {
  router.post({
    path: '/api/logstash/pipelines/delete',
    validate: {
      body: _configSchema.schema.object({
        pipelineIds: _configSchema.schema.arrayOf(_configSchema.schema.string())
      })
    }
  }, (0, _server.wrapRouteWithLicenseCheck)(_check_license.checkLicense, router.handleLegacyErrors(async (context, request, response) => {
    const client = context.core.elasticsearch.client.asCurrentUser;
    const results = await deletePipelines(client, request.body.pipelineIds);
    return response.ok({
      body: {
        results
      }
    });
  })));
}