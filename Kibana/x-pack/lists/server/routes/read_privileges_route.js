"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readPrivilegesRoute = void 0;

var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");

var _fp = require("lodash/fp");

var _securitysolutionListConstants = require("@kbn/securitysolution-list-constants");

var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const readPrivilegesRoute = router => {
  router.get({
    options: {
      tags: ['access:lists-read']
    },
    path: _securitysolutionListConstants.LIST_PRIVILEGES_URL,
    validate: false
  }, async (context, request, response) => {
    const siemResponse = (0, _utils.buildSiemResponse)(response);

    try {
      var _request$auth$isAuthe;

      const esClient = context.core.elasticsearch.client.asCurrentUser;
      const lists = (0, _utils.getListClient)(context);
      const clusterPrivilegesLists = await (0, _securitysolutionEsUtils.readPrivileges)(esClient, lists.getListIndex());
      const clusterPrivilegesListItems = await (0, _securitysolutionEsUtils.readPrivileges)(esClient, lists.getListItemIndex());
      const privileges = (0, _fp.merge)({
        listItems: clusterPrivilegesListItems,
        lists: clusterPrivilegesLists
      }, {
        is_authenticated: (_request$auth$isAuthe = request.auth.isAuthenticated) !== null && _request$auth$isAuthe !== void 0 ? _request$auth$isAuthe : false
      });
      return response.ok({
        body: privileges
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

exports.readPrivilegesRoute = readPrivilegesRoute;