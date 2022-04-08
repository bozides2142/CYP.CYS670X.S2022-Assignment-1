"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerJobGenerationRoutes = registerJobGenerationRoutes;

var _configSchema = require("@kbn/config-schema");

var _risonNode = _interopRequireDefault(require("rison-node"));

var _constants = require("../../../common/constants");

var _authorized_user_pre_routing = require("../lib/authorized_user_pre_routing");

var _request_handler = require("../lib/request_handler");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const BASE_GENERATE = `${_constants.API_BASE_URL}/generate`;

function registerJobGenerationRoutes(reporting, logger) {
  const setupDeps = reporting.getPluginSetupDeps();
  const {
    router
  } = setupDeps; // TODO: find a way to abstract this using ExportTypeRegistry: it needs a new
  // public method to return this array
  // const registry = reporting.getExportTypesRegistry();
  // const kibanaAccessControlTags = registry.getAllAccessControlTags();

  const useKibanaAccessControl = reporting.getDeprecatedAllowedRoles() === false; // true if Reporting's deprecated access control feature is disabled

  const kibanaAccessControlTags = useKibanaAccessControl ? ['access:generateReport'] : [];
  router.post({
    path: `${BASE_GENERATE}/{exportType}`,
    validate: {
      params: _configSchema.schema.object({
        exportType: _configSchema.schema.string({
          minLength: 2
        })
      }),
      body: _configSchema.schema.nullable(_configSchema.schema.object({
        jobParams: _configSchema.schema.maybe(_configSchema.schema.string())
      })),
      query: _configSchema.schema.nullable(_configSchema.schema.object({
        jobParams: _configSchema.schema.string({
          defaultValue: ''
        })
      }))
    },
    options: {
      tags: kibanaAccessControlTags
    }
  }, (0, _authorized_user_pre_routing.authorizedUserPreRouting)(reporting, async (user, context, req, res) => {
    var _req$query;

    let jobParamsRison = null;

    if (req.body) {
      const {
        jobParams: jobParamsPayload
      } = req.body;
      jobParamsRison = jobParamsPayload ? jobParamsPayload : null;
    } else if ((_req$query = req.query) !== null && _req$query !== void 0 && _req$query.jobParams) {
      const {
        jobParams: queryJobParams
      } = req.query;

      if (queryJobParams) {
        jobParamsRison = queryJobParams;
      } else {
        jobParamsRison = null;
      }
    }

    if (!jobParamsRison) {
      return res.customError({
        statusCode: 400,
        body: 'A jobParams RISON string is required in the querystring or POST body'
      });
    }

    let jobParams;

    try {
      jobParams = _risonNode.default.decode(jobParamsRison);

      if (!jobParams) {
        return res.customError({
          statusCode: 400,
          body: 'Missing jobParams!'
        });
      }
    } catch (err) {
      return res.customError({
        statusCode: 400,
        body: `invalid rison: ${jobParamsRison}`
      });
    }

    const requestHandler = new _request_handler.RequestHandler(reporting, user, context, req, res, logger);

    try {
      return await requestHandler.handleGenerateRequest(req.params.exportType, jobParams);
    } catch (err) {
      return requestHandler.handleError(err);
    }
  })); // Get route to generation endpoint: show error about GET method to user

  router.get({
    path: `${BASE_GENERATE}/{p*}`,
    validate: false
  }, (_context, _req, res) => {
    return res.customError({
      statusCode: 405,
      body: 'GET is not allowed'
    });
  });
}