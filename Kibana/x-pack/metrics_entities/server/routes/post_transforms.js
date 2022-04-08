"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.postTransforms = void 0;

var _configSchema = require("@kbn/config-schema");

var _constants = require("../../common/constants");

var _get_metrics_entities_client = require("./utils/get_metrics_entities_client");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Creates transforms.
 * @param router The router to get the collection of transforms
 */


const postTransforms = router => {
  router.post({
    path: _constants.METRICS_ENTITIES_TRANSFORMS,
    validate: {
      // TODO: Add the validation instead of allowing handler to have access to raw non-validated in runtime
      body: _configSchema.schema.object({}, {
        unknowns: 'allow'
      }),
      query: _configSchema.schema.object({}, {
        unknowns: 'allow'
      })
    }
  }, async (context, request, response) => {
    // TODO: Type this through validation above and remove the weird casting of: "as { modules: ModuleNames };"
    // TODO: Validate for runtime that the module exists or not and throw before pushing the module name lower
    // TODO: Change modules to be part of the body and become an array of values
    // TODO: Wrap this in a try catch block and report errors
    const {
      modules,
      auto_start: autoStart = false,
      settings: {
        max_page_search_size: maxPageSearchSize = 500,
        docs_per_second: docsPerSecond = undefined
      } = {
        docsPerSecond: undefined,
        maxPageSearchSize: 500
      },
      frequency = '1m',
      indices,
      query = {
        match_all: {}
      },
      prefix = '',
      suffix = '',
      sync = {
        time: {
          delay: '60s',
          field: '@timestamp'
        }
      }
    } = request.body;
    const metrics = (0, _get_metrics_entities_client.getMetricsEntitiesClient)(context);
    await metrics.postTransforms({
      autoStart,
      docsPerSecond,
      frequency,
      indices,
      maxPageSearchSize,
      modules,
      prefix,
      query,
      suffix,
      sync
    });
    return response.custom({
      body: {
        acknowledged: true
      },
      statusCode: 201
    });
  });
};

exports.postTransforms = postTransforms;