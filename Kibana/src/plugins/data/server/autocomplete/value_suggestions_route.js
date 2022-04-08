"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerValueSuggestionsRoute = registerValueSuggestionsRoute;

var _configSchema = require("@kbn/config-schema");

var _operators = require("rxjs/operators");

var _lib = require("../lib");

var _server = require("../../../kibana_utils/server");

var _terms_enum = require("./terms_enum");

var _terms_agg = require("./terms_agg");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function registerValueSuggestionsRoute(router, config$) {
  router.post({
    path: '/api/kibana/suggestions/values/{index}',
    validate: {
      params: _configSchema.schema.object({
        index: _configSchema.schema.string()
      }, {
        unknowns: 'allow'
      }),
      body: _configSchema.schema.object({
        field: _configSchema.schema.string(),
        query: _configSchema.schema.string(),
        filters: _configSchema.schema.maybe(_configSchema.schema.any()),
        fieldMeta: _configSchema.schema.maybe(_configSchema.schema.any()),
        method: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.literal('terms_agg'), _configSchema.schema.literal('terms_enum')]))
      }, {
        unknowns: 'allow'
      })
    }
  }, async (context, request, response) => {
    const config = await config$.pipe((0, _operators.first)()).toPromise();
    const {
      field: fieldName,
      query,
      filters,
      fieldMeta,
      method
    } = request.body;
    const {
      index
    } = request.params;
    const abortSignal = (0, _lib.getRequestAbortedSignal)(request.events.aborted$);

    try {
      const fn = method === 'terms_agg' ? _terms_agg.termsAggSuggestions : _terms_enum.termsEnumSuggestions;
      const body = await fn(config, context.core.savedObjects.client, context.core.elasticsearch.client.asCurrentUser, index, fieldName, query, filters, fieldMeta, abortSignal);
      return response.ok({
        body
      });
    } catch (e) {
      const kbnErr = (0, _server.getKbnServerError)(e);
      return (0, _server.reportServerError)(response, kbnErr);
    }
  });
}