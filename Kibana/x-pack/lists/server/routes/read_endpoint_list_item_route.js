"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readEndpointListItemRoute = void 0;

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


const readEndpointListItemRoute = router => {
  router.get({
    options: {
      tags: ['access:lists-read']
    },
    path: _securitysolutionListConstants.ENDPOINT_LIST_ITEM_URL,
    validate: {
      query: (0, _utils.buildRouteValidation)(_securitysolutionIoTsListTypes.readEndpointListItemSchema)
    }
  }, async (context, request, response) => {
    const siemResponse = (0, _utils.buildSiemResponse)(response);

    try {
      const {
        id,
        item_id: itemId
      } = request.query;
      const exceptionLists = (0, _utils.getExceptionListClient)(context);

      if (id != null || itemId != null) {
        const exceptionListItem = await exceptionLists.getEndpointListItem({
          id,
          itemId
        });

        if (exceptionListItem == null) {
          return siemResponse.error({
            body: (0, _utils.getErrorMessageExceptionListItem)({
              id,
              itemId
            }),
            statusCode: 404
          });
        } else {
          const [validated, errors] = (0, _securitysolutionIoTsUtils.validate)(exceptionListItem, _securitysolutionIoTsListTypes.exceptionListItemSchema);

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
        }
      } else {
        return siemResponse.error({
          body: 'id or item_id required',
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

exports.readEndpointListItemRoute = readEndpointListItemRoute;