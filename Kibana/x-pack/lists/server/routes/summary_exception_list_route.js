"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.summaryExceptionListRoute = void 0;

var _securitysolutionIoTsUtils = require("@kbn/securitysolution-io-ts-utils");

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


const summaryExceptionListRoute = router => {
  router.get({
    options: {
      tags: ['access:lists-summary']
    },
    path: `${_securitysolutionListConstants.EXCEPTION_LIST_URL}/summary`,
    validate: {
      query: (0, _utils.buildRouteValidation)(_securitysolutionIoTsListTypes.summaryExceptionListSchema)
    }
  }, async (context, request, response) => {
    const siemResponse = (0, _utils.buildSiemResponse)(response);

    try {
      const {
        id,
        list_id: listId,
        namespace_type: namespaceType,
        filter
      } = request.query;
      const exceptionLists = (0, _utils.getExceptionListClient)(context);

      if (id != null || listId != null) {
        const exceptionListSummary = await exceptionLists.getExceptionListSummary({
          filter,
          id,
          listId,
          namespaceType
        });

        if (exceptionListSummary == null) {
          return siemResponse.error({
            body: (0, _utils.getErrorMessageExceptionList)({
              id,
              listId
            }),
            statusCode: 404
          });
        } else {
          const [validated, errors] = (0, _securitysolutionIoTsUtils.validate)(exceptionListSummary, _securitysolutionIoTsListTypes.exceptionListSummarySchema);

          if (errors != null) {
            return response.ok({
              body: exceptionListSummary
            });
          } else {
            return response.ok({
              body: validated !== null && validated !== void 0 ? validated : {}
            });
          }
        }
      } else {
        return siemResponse.error({
          body: 'id or list_id required',
          statusCode: 400
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

exports.summaryExceptionListRoute = summaryExceptionListRoute;