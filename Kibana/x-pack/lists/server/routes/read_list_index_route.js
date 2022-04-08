"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readListIndexRoute = void 0;

var _securitysolutionIoTsUtils = require("@kbn/securitysolution-io-ts-utils");

var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");

var _securitysolutionIoTsListTypes = require("@kbn/securitysolution-io-ts-list-types");

var _securitysolutionListConstants = require("@kbn/securitysolution-list-constants");

var _utils = require("./utils");

var _2 = require(".");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const readListIndexRoute = router => {
  router.get({
    options: {
      tags: ['access:lists-read']
    },
    path: _securitysolutionListConstants.LIST_INDEX,
    validate: false
  }, async (context, _, response) => {
    const siemResponse = (0, _utils.buildSiemResponse)(response);

    try {
      const lists = (0, _2.getListClient)(context);
      const listIndexExists = await lists.getListIndexExists();
      const listItemIndexExists = await lists.getListItemIndexExists();

      if (listIndexExists || listItemIndexExists) {
        const [validated, errors] = (0, _securitysolutionIoTsUtils.validate)({
          list_index: listIndexExists,
          list_item_index: listItemIndexExists
        }, _securitysolutionIoTsListTypes.listItemIndexExistSchema);

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
      } else if (!listIndexExists && listItemIndexExists) {
        return siemResponse.error({
          body: `index ${lists.getListIndex()} does not exist`,
          statusCode: 404
        });
      } else if (!listItemIndexExists && listIndexExists) {
        return siemResponse.error({
          body: `index ${lists.getListItemIndex()} does not exist`,
          statusCode: 404
        });
      } else {
        return siemResponse.error({
          body: `index ${lists.getListIndex()} and index ${lists.getListItemIndex()} does not exist`,
          statusCode: 404
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

exports.readListIndexRoute = readListIndexRoute;