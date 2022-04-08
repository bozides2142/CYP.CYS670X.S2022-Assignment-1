"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.importExceptionsRoute = void 0;

var _path = require("path");

var _configSchema = require("@kbn/config-schema");

var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");

var _securitysolutionIoTsListTypes = require("@kbn/securitysolution-io-ts-list-types");

var _securitysolutionListConstants = require("@kbn/securitysolution-list-constants");

var _securitysolutionIoTsUtils = require("@kbn/securitysolution-io-ts-utils");

var _securitysolutionIoTsTypes = require("@kbn/securitysolution-io-ts-types");

var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Takes an ndjson file of exception lists and exception list items and
 * imports them by either creating or updating lists/items given a clients
 * choice to overwrite any matching lists
 */


const importExceptionsRoute = (router, config) => {
  router.post({
    options: {
      body: {
        maxBytes: config.maxImportPayloadBytes,
        output: 'stream'
      },
      tags: ['access:lists-all']
    },
    path: `${_securitysolutionListConstants.EXCEPTION_LIST_URL}/_import`,
    validate: {
      body: _configSchema.schema.any(),
      // validation on file object is accomplished later in the handler.
      query: (0, _utils.buildRouteValidation)(_securitysolutionIoTsTypes.importQuerySchema)
    }
  }, async (context, request, response) => {
    const exceptionListsClient = (0, _utils.getExceptionListClient)(context);
    const siemResponse = (0, _utils.buildSiemResponse)(response);

    try {
      const {
        filename
      } = request.body.file.hapi;
      const fileExtension = (0, _path.extname)(filename).toLowerCase();

      if (fileExtension !== '.ndjson') {
        return siemResponse.error({
          body: `Invalid file extension ${fileExtension}`,
          statusCode: 400
        });
      }

      const importsSummary = await exceptionListsClient.importExceptionListAndItems({
        exceptionsToImport: request.body.file,
        maxExceptionsImportSize: config.maxExceptionsImportSize,
        overwrite: request.query.overwrite
      });
      const [validated, errors] = (0, _securitysolutionIoTsUtils.validate)(importsSummary, _securitysolutionIoTsListTypes.importExceptionsResponseSchema);

      if (errors != null) {
        return siemResponse.error({
          body: errors,
          statusCode: 500
        });
      } else {
        return response.ok({
          body: validated !== null && validated !== void 0 ? validated : {}
        });
      }
    } catch (err) {
      const error = (0, _securitysolutionEsUtils.transformError)(err);
      return siemResponse.error({
        body: error.message,
        statusCode: error.statusCode
      });
    }
  });
};

exports.importExceptionsRoute = importExceptionsRoute;