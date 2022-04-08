"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readListRoute = void 0;

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


const readListRoute = router => {
  router.get({
    options: {
      tags: ['access:lists-read']
    },
    path: _securitysolutionListConstants.LIST_URL,
    validate: {
      query: (0, _utils.buildRouteValidation)(_securitysolutionIoTsListTypes.readListSchema)
    }
  }, async (context, request, response) => {
    const siemResponse = (0, _utils.buildSiemResponse)(response);

    try {
      const {
        id
      } = request.query;
      const lists = (0, _.getListClient)(context);
      const list = await lists.getList({
        id
      });

      if (list == null) {
        return siemResponse.error({
          body: `list id: "${id}" does not exist`,
          statusCode: 404
        });
      } else {
        const [validated, errors] = (0, _securitysolutionIoTsUtils.validate)(list, _securitysolutionIoTsListTypes.listSchema);

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

exports.readListRoute = readListRoute;