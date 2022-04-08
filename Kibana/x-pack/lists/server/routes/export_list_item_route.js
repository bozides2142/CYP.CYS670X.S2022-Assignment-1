"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.exportListItemRoute = void 0;

var _stream = require("stream");

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


const exportListItemRoute = router => {
  router.post({
    options: {
      tags: ['access:lists-read']
    },
    path: `${_securitysolutionListConstants.LIST_ITEM_URL}/_export`,
    validate: {
      query: (0, _utils.buildRouteValidation)(_securitysolutionIoTsListTypes.exportListItemQuerySchema)
    }
  }, async (context, request, response) => {
    const siemResponse = (0, _utils.buildSiemResponse)(response);

    try {
      const {
        list_id: listId
      } = request.query;
      const lists = (0, _.getListClient)(context);
      const list = await lists.getList({
        id: listId
      });

      if (list == null) {
        return siemResponse.error({
          body: `list_id: ${listId} does not exist`,
          statusCode: 400
        });
      } else {
        // TODO: Allow the API to override the name of the file to export
        const fileName = list.name;
        const stream = new _stream.Stream.PassThrough();
        lists.exportListItemsToStream({
          listId,
          stream,
          stringToAppend: '\n'
        });
        return response.ok({
          body: stream,
          headers: {
            'Content-Disposition': `attachment; filename="${fileName}"`,
            'Content-Type': 'application/ndjson'
          }
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

exports.exportListItemRoute = exportListItemRoute;