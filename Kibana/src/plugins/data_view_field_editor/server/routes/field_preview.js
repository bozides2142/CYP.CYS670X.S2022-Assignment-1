"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerFieldPreviewRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _constants = require("../../common/constants");

var _shared_imports = require("../shared_imports");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const bodySchema = _configSchema.schema.object({
  index: _configSchema.schema.string(),
  script: _configSchema.schema.object({
    source: _configSchema.schema.string()
  }),
  context: _configSchema.schema.oneOf([_configSchema.schema.literal('boolean_field'), _configSchema.schema.literal('date_field'), _configSchema.schema.literal('double_field'), _configSchema.schema.literal('geo_point_field'), _configSchema.schema.literal('ip_field'), _configSchema.schema.literal('keyword_field'), _configSchema.schema.literal('long_field')]),
  document: _configSchema.schema.object({}, {
    unknowns: 'allow'
  }),
  documentId: _configSchema.schema.string()
});

const registerFieldPreviewRoute = ({
  router
}) => {
  router.post({
    path: `${_constants.API_BASE_PATH}/field_preview`,
    validate: {
      body: bodySchema
    }
  }, async (ctx, req, res) => {
    const {
      client
    } = ctx.core.elasticsearch;
    const type = req.body.context.split('_field')[0];
    const body = {
      runtime_mappings: {
        my_runtime_field: {
          type,
          script: req.body.script
        }
      },
      size: 1,
      query: {
        term: {
          _id: req.body.documentId
        }
      },
      fields: ['my_runtime_field']
    };

    try {
      var _response$body$hits$h, _response$body$hits$h2, _response$body$hits$h3;

      // Ideally we want to use the Painless _execute API to get the runtime field preview.
      // There is a current ES limitation that requires a user to have too many privileges
      // to execute the script. (issue: https://github.com/elastic/elasticsearch/issues/48856)
      // Until we find a way to execute a script without advanced privileges we are going to
      // use the Search API to get the field value (and possible errors).
      // Note: here is the PR were we changed from using Painless _execute to _search and should be
      // reverted when the ES issue is fixed: https://github.com/elastic/kibana/pull/115070
      const response = await client.asCurrentUser.search({
        index: req.body.index,
        body
      });
      const fieldValue = (_response$body$hits$h = (_response$body$hits$h2 = response.body.hits.hits[0]) === null || _response$body$hits$h2 === void 0 ? void 0 : (_response$body$hits$h3 = _response$body$hits$h2.fields) === null || _response$body$hits$h3 === void 0 ? void 0 : _response$body$hits$h3.my_runtime_field) !== null && _response$body$hits$h !== void 0 ? _response$body$hits$h : '';
      return res.ok({
        body: {
          values: fieldValue
        }
      });
    } catch (error) {
      // Assume invalid painless script was submitted
      // Return 200 with error object
      const handleCustomError = () => {
        var _error$body$error$fai, _error$body$error$fai2;

        return res.ok({
          body: {
            values: [],
            error: (_error$body$error$fai = (_error$body$error$fai2 = error.body.error.failed_shards[0]) === null || _error$body$error$fai2 === void 0 ? void 0 : _error$body$error$fai2.reason) !== null && _error$body$error$fai !== void 0 ? _error$body$error$fai : {}
          }
        });
      };

      return (0, _shared_imports.handleEsError)({
        error,
        response: res,
        handleCustomError
      });
    }
  });
};

exports.registerFieldPreviewRoute = registerFieldPreviewRoute;