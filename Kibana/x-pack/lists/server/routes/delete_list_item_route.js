"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteListItemRoute = void 0;

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


const deleteListItemRoute = router => {
  router.delete({
    options: {
      tags: ['access:lists-all']
    },
    path: _securitysolutionListConstants.LIST_ITEM_URL,
    validate: {
      query: (0, _utils.buildRouteValidation)(_securitysolutionIoTsListTypes.deleteListItemSchema)
    }
  }, async (context, request, response) => {
    const siemResponse = (0, _utils.buildSiemResponse)(response);

    try {
      const {
        id,
        list_id: listId,
        value
      } = request.query;
      const lists = (0, _.getListClient)(context);

      if (id != null) {
        const deleted = await lists.deleteListItem({
          id
        });

        if (deleted == null) {
          return siemResponse.error({
            body: `list item with id: "${id}" not found`,
            statusCode: 404
          });
        } else {
          const [validated, errors] = (0, _securitysolutionIoTsUtils.validate)(deleted, _securitysolutionIoTsListTypes.listItemSchema);

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
      } else if (listId != null && value != null) {
        const list = await lists.getList({
          id: listId
        });

        if (list == null) {
          return siemResponse.error({
            body: `list_id: "${listId}" does not exist`,
            statusCode: 404
          });
        } else {
          const deleted = await lists.deleteListItemByValue({
            listId,
            type: list.type,
            value
          });

          if (deleted == null || deleted.length === 0) {
            return siemResponse.error({
              body: `list_id: "${listId}" with ${value} was not found`,
              statusCode: 404
            });
          } else {
            const [validated, errors] = (0, _securitysolutionIoTsUtils.validate)(deleted, _securitysolutionIoTsListTypes.listItemArraySchema);

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
      } else {
        return siemResponse.error({
          body: 'Either "list_id" or "id" needs to be defined in the request',
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

exports.deleteListItemRoute = deleteListItemRoute;