"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.exportExceptionsRoute = void 0;

var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");

var _securitysolutionIoTsListTypes = require("@kbn/securitysolution-io-ts-list-types");

var _securitysolutionListConstants = require("@kbn/securitysolution-list-constants");

var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const exportExceptionsRoute = router => {
  router.post({
    options: {
      tags: ['access:lists-read']
    },
    path: `${_securitysolutionListConstants.EXCEPTION_LIST_URL}/_export`,
    validate: {
      query: (0, _utils.buildRouteValidation)(_securitysolutionIoTsListTypes.exportExceptionListQuerySchema)
    }
  }, async (context, request, response) => {
    const siemResponse = (0, _utils.buildSiemResponse)(response);

    try {
      const {
        id,
        list_id: listId,
        namespace_type: namespaceType
      } = request.query;
      const exceptionListsClient = (0, _utils.getExceptionListClient)(context);
      const exportContent = await exceptionListsClient.exportExceptionListAndItems({
        id,
        listId,
        namespaceType
      });

      if (exportContent == null) {
        return siemResponse.error({
          body: `exception list with list_id: ${listId} or id: ${id} does not exist`,
          statusCode: 400
        });
      }

      return response.ok({
        body: `${exportContent.exportData}${JSON.stringify(exportContent.exportDetails)}\n`,
        headers: {
          'Content-Disposition': `attachment; filename="${listId}"`,
          'Content-Type': 'application/ndjson'
        }
      });
    } catch (err) {
      const error = (0, _securitysolutionEsUtils.transformError)(err);
      return siemResponse.error({
        body: error.message,
        statusCode: error.statusCode
      });
    }
  });
};

exports.exportExceptionsRoute = exportExceptionsRoute;