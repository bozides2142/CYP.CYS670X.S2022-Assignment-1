"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerRoutes = registerRoutes;

var _configSchema = require("@kbn/config-schema");

var _fetcher = require("./fetcher");

var _rest_api_routes = require("./rest_api_routes");

var _fields_for = require("./fields_for");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function registerRoutes(http, getStartServices, dataViewRestCounter) {
  const parseMetaFields = metaFields => {
    let parsedFields = [];

    if (typeof metaFields === 'string') {
      parsedFields = JSON.parse(metaFields);
    } else {
      parsedFields = metaFields;
    }

    return parsedFields;
  };

  const router = http.createRouter();

  _rest_api_routes.routes.forEach(route => route(router, getStartServices, dataViewRestCounter));

  (0, _fields_for.registerFieldForWildcard)(router, getStartServices);
  router.get({
    path: '/api/index_patterns/_fields_for_time_pattern',
    validate: {
      query: _configSchema.schema.object({
        pattern: _configSchema.schema.string(),
        interval: _configSchema.schema.maybe(_configSchema.schema.string()),
        look_back: _configSchema.schema.number({
          min: 1
        }),
        meta_fields: _configSchema.schema.oneOf([_configSchema.schema.string(), _configSchema.schema.arrayOf(_configSchema.schema.string())], {
          defaultValue: []
        })
      })
    }
  }, async (context, request, response) => {
    const {
      asCurrentUser
    } = context.core.elasticsearch.client;
    const indexPatterns = new _fetcher.IndexPatternsFetcher(asCurrentUser);
    const {
      pattern,
      interval,
      look_back: lookBack,
      meta_fields: metaFields
    } = request.query;
    let parsedFields = [];

    try {
      parsedFields = parseMetaFields(metaFields);
    } catch (error) {
      return response.badRequest();
    }

    try {
      const fields = await indexPatterns.getFieldsForTimePattern({
        pattern,
        interval: interval ? interval : '',
        lookBack,
        metaFields: parsedFields
      });
      return response.ok({
        body: {
          fields
        },
        headers: {
          'content-type': 'application/json'
        }
      });
    } catch (error) {
      return response.notFound();
    }
  });
}