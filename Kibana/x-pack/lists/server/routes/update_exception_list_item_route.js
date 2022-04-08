"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateExceptionListItemRoute = void 0;

var _securitysolutionIoTsUtils = require("@kbn/securitysolution-io-ts-utils");

var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");

var _securitysolutionIoTsListTypes = require("@kbn/securitysolution-io-ts-list-types");

var _securitysolutionListConstants = require("@kbn/securitysolution-list-constants");

var _utils = require("./utils");

var _ = require(".");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const updateExceptionListItemRoute = router => {
  router.put({
    options: {
      tags: ['access:lists-all']
    },
    path: _securitysolutionListConstants.EXCEPTION_LIST_ITEM_URL,
    validate: {
      body: (0, _utils.buildRouteValidation)(_securitysolutionIoTsListTypes.updateExceptionListItemSchema)
    }
  }, async (context, request, response) => {
    const siemResponse = (0, _utils.buildSiemResponse)(response);
    const validationErrors = (0, _securitysolutionIoTsListTypes.updateExceptionListItemValidate)(request.body);

    if (validationErrors.length) {
      return siemResponse.error({
        body: validationErrors,
        statusCode: 400
      });
    }

    try {
      const {
        description,
        id,
        name,
        meta,
        type,
        _version,
        comments,
        entries,
        item_id: itemId,
        namespace_type: namespaceType,
        os_types: osTypes,
        tags
      } = request.body;

      if (id == null && itemId == null) {
        return siemResponse.error({
          body: 'either id or item_id need to be defined',
          statusCode: 404
        });
      } else {
        const exceptionLists = (0, _.getExceptionListClient)(context);
        const exceptionListItem = await exceptionLists.updateExceptionListItem({
          _version,
          comments,
          description,
          entries,
          id,
          itemId,
          meta,
          name,
          namespaceType,
          osTypes,
          tags,
          type
        });

        if (exceptionListItem == null) {
          if (id != null) {
            return siemResponse.error({
              body: `exception list item id: "${id}" does not exist`,
              statusCode: 404
            });
          } else {
            return siemResponse.error({
              body: `exception list item item_id: "${itemId}" does not exist`,
              statusCode: 404
            });
          }
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

exports.updateExceptionListItemRoute = updateExceptionListItemRoute;