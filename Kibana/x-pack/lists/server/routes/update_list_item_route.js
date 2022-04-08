"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateListItemRoute = void 0;

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


const updateListItemRoute = router => {
  router.put({
    options: {
      tags: ['access:lists-all']
    },
    path: _securitysolutionListConstants.LIST_ITEM_URL,
    validate: {
      body: (0, _utils.buildRouteValidation)(_securitysolutionIoTsListTypes.updateListItemSchema)
    }
  }, async (context, request, response) => {
    const siemResponse = (0, _utils.buildSiemResponse)(response);

    try {
      const {
        value,
        id,
        meta,
        _version
      } = request.body;
      const lists = (0, _.getListClient)(context);
      const listItem = await lists.updateListItem({
        _version,
        id,
        meta,
        value
      });

      if (listItem == null) {
        return siemResponse.error({
          body: `list item id: "${id}" not found`,
          statusCode: 404
        });
      } else {
        const [validated, errors] = (0, _securitysolutionIoTsUtils.validate)(listItem, _securitysolutionIoTsListTypes.listItemSchema);

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
    } catch (err) {
      const error = (0, _securitysolutionEsUtils.transformError)(err);
      return siemResponse.error({
        body: error.message,
        statusCode: error.statusCode
      });
    }
  });
};

exports.updateListItemRoute = updateListItemRoute;