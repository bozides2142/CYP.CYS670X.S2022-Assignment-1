"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerHasUserDataViewRouteLegacy = exports.registerHasUserDataViewRoute = exports.hasUserDataView = void 0;

var _handle_errors = require("./util/handle_errors");

var _constants = require("../constants");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const hasUserDataView = async ({
  dataViewsService,
  usageCollection,
  counterName
}) => {
  usageCollection === null || usageCollection === void 0 ? void 0 : usageCollection.incrementCounter({
    counterName
  });
  return dataViewsService.hasUserDataView();
};

exports.hasUserDataView = hasUserDataView;

const hasUserDataViewRouteFactory = path => (router, getStartServices, usageCollection) => {
  router.get({
    path,
    validate: {}
  }, router.handleLegacyErrors((0, _handle_errors.handleErrors)(async (ctx, req, res) => {
    const savedObjectsClient = ctx.core.savedObjects.client;
    const elasticsearchClient = ctx.core.elasticsearch.client.asCurrentUser;
    const [,, {
      dataViewsServiceFactory
    }] = await getStartServices();
    const dataViewsService = await dataViewsServiceFactory(savedObjectsClient, elasticsearchClient, req);
    const result = await hasUserDataView({
      dataViewsService,
      usageCollection,
      counterName: `${req.route.method} ${path}`
    });
    return res.ok({
      body: {
        result
      }
    });
  })));
};

const registerHasUserDataViewRoute = hasUserDataViewRouteFactory(`${_constants.SERVICE_PATH}/has_user_data_view`);
exports.registerHasUserDataViewRoute = registerHasUserDataViewRoute;
const registerHasUserDataViewRouteLegacy = hasUserDataViewRouteFactory(`${_constants.SERVICE_PATH_LEGACY}/has_user_index_pattern`);
exports.registerHasUserDataViewRouteLegacy = registerHasUserDataViewRouteLegacy;