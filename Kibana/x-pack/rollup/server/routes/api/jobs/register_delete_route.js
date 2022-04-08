"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerDeleteRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _services = require("../../../services");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const registerDeleteRoute = ({
  router,
  license,
  lib: {
    handleEsError
  }
}) => {
  router.post({
    path: (0, _services.addBasePath)('/delete'),
    validate: {
      body: _configSchema.schema.object({
        jobIds: _configSchema.schema.arrayOf(_configSchema.schema.string())
      })
    }
  }, license.guardApiRoute(async (context, request, response) => {
    const {
      client: clusterClient
    } = context.core.elasticsearch;

    try {
      const {
        jobIds
      } = request.body;
      const data = await Promise.all(jobIds.map(id => clusterClient.asCurrentUser.rollup.deleteJob({
        id
      }))).then(() => ({
        success: true
      }));
      return response.ok({
        body: data
      });
    } catch (err) {
      var _err$body, _err$body$task_failur, _err$body$task_failur2, _err$body$task_failur3, _err$body$task_failur4; // There is an issue opened on ES to handle the following error correctly
      // https://github.com/elastic/elasticsearch/issues/42908
      // Until then we'll modify the response here.


      if (err !== null && err !== void 0 && err.meta && (_err$body = err.body) !== null && _err$body !== void 0 && (_err$body$task_failur = _err$body.task_failures) !== null && _err$body$task_failur !== void 0 && (_err$body$task_failur2 = _err$body$task_failur[0]) !== null && _err$body$task_failur2 !== void 0 && (_err$body$task_failur3 = _err$body$task_failur2.reason) !== null && _err$body$task_failur3 !== void 0 && (_err$body$task_failur4 = _err$body$task_failur3.reason) !== null && _err$body$task_failur4 !== void 0 && _err$body$task_failur4.includes('Job must be [STOPPED] before deletion')) {
        err.meta.status = 400;
        err.meta.statusCode = 400;
        err.meta.displayName = 'Bad request';
        err.message = err.body.task_failures[0].reason.reason;
      }

      return handleEsError({
        error: err,
        response
      });
    }
  }));
};

exports.registerDeleteRoute = registerDeleteRoute;