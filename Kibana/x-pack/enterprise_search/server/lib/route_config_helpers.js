"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.skipBodyValidation = void 0;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Kibana Enterprise Search Plugin API endpoints often times pass through the request
 * body to the Enterprise Search API endpoints for validation. In those cases, we do not
 * need to validate them in Kibana.
 *
 * The safe way to do that is to turn off body parsing entirely using `options.body.parse: false`.
 * The will pass a String Buffer to the route handler. The proper way to validate this when validation
 * is enabled to to use `body: schema.buffer()`.
 *
 * @see https://github.com/elastic/kibana/blob/main/docs/development/core/server/kibana-plugin-core-server.routeconfigoptionsbody.md
 * @see https://github.com/elastic/kibana/blob/main/packages/kbn-config-schema/README.md#schemabuffer
 *
 * Example:
 *  router.put({
 *    path: '/internal/app_search/engines/{engineName}/example',
 *    validate: {
 *      params: schema.object({
 *        engineName: schema.string(),
 *      }),
 *      body: schema.buffer(),
 *    },
 *    options: { body: { parse: false } },
 *  },
 *  ...
 *
 * This helper applies that pattern, while maintaining existing options:
 *
 *  router.put(skipBodyValidation({
 *    path: '/internal/app_search/engines/{engineName}/example',
 *    validate: {
 *      params: schema.object({
 *        engineName: schema.string(),
 *      }),
 *    },
 *  },
 *  ...
 */


const skipBodyValidation = config => {
  return { ...config,
    validate: { ...config.validate,
      body: _configSchema.schema.buffer()
    },
    options: { ...(config.options || {}),
      body: {
        parse: false
      }
    }
  };
};

exports.skipBodyValidation = skipBodyValidation;