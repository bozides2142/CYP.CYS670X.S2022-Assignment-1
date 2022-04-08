"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerFieldForWildcard = void 0;

var _configSchema = require("@kbn/config-schema");

var _fetcher = require("./fetcher");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const parseMetaFields = metaFields => {
  let parsedFields = [];

  if (typeof metaFields === 'string') {
    parsedFields = JSON.parse(metaFields);
  } else {
    parsedFields = metaFields;
  }

  return parsedFields;
};

const path = '/api/index_patterns/_fields_for_wildcard';
const validate = {
  query: _configSchema.schema.object({
    pattern: _configSchema.schema.string(),
    meta_fields: _configSchema.schema.oneOf([_configSchema.schema.string(), _configSchema.schema.arrayOf(_configSchema.schema.string())], {
      defaultValue: []
    }),
    type: _configSchema.schema.maybe(_configSchema.schema.string()),
    rollup_index: _configSchema.schema.maybe(_configSchema.schema.string()),
    allow_no_index: _configSchema.schema.maybe(_configSchema.schema.boolean())
  }),
  // not available to get request
  body: _configSchema.schema.maybe(_configSchema.schema.object({
    index_filter: _configSchema.schema.any()
  }))
};

const handler = async (context, request, response) => {
  var _request$body;

  const {
    asCurrentUser
  } = context.core.elasticsearch.client;
  const indexPatterns = new _fetcher.IndexPatternsFetcher(asCurrentUser);
  const {
    pattern,
    meta_fields: metaFields,
    type,
    rollup_index: rollupIndex,
    allow_no_index: allowNoIndex
  } = request.query; // not available to get request

  const filter = (_request$body = request.body) === null || _request$body === void 0 ? void 0 : _request$body.index_filter;
  let parsedFields = [];

  try {
    parsedFields = parseMetaFields(metaFields);
  } catch (error) {
    return response.badRequest();
  }

  try {
    const fields = await indexPatterns.getFieldsForWildcard({
      pattern,
      metaFields: parsedFields,
      type,
      rollupIndex,
      fieldCapsOptions: {
        allow_no_indices: allowNoIndex || false
      },
      filter
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
    var _error$output, _error$output2;

    if (typeof error === 'object' && !!(error !== null && error !== void 0 && error.isBoom) && !!(error !== null && error !== void 0 && (_error$output = error.output) !== null && _error$output !== void 0 && _error$output.payload) && typeof (error === null || error === void 0 ? void 0 : (_error$output2 = error.output) === null || _error$output2 === void 0 ? void 0 : _error$output2.payload) === 'object') {
      var _error$output3;

      const payload = error === null || error === void 0 ? void 0 : (_error$output3 = error.output) === null || _error$output3 === void 0 ? void 0 : _error$output3.payload;
      return response.notFound({
        body: {
          message: payload.message,
          attributes: payload
        }
      });
    } else {
      return response.notFound();
    }
  }
};

const registerFieldForWildcard = (router, getStartServices) => {
  router.put({
    path,
    validate
  }, handler);
  router.get({
    path,
    validate
  }, handler);
};

exports.registerFieldForWildcard = registerFieldForWildcard;