"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerGetDataViewRouteLegacy = exports.registerGetDataViewRoute = exports.getDataView = void 0;

var _configSchema = require("@kbn/config-schema");

var _handle_errors = require("./util/handle_errors");

var _constants = require("../constants");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const getDataView = async ({
  dataViewsService,
  usageCollection,
  counterName,
  id
}) => {
  usageCollection === null || usageCollection === void 0 ? void 0 : usageCollection.incrementCounter({
    counterName
  });
  return dataViewsService.get(id);
};

exports.getDataView = getDataView;

const getDataViewRouteFactory = (path, serviceKey) => (router, getStartServices, usageCollection) => {
  router.get({
    path,
    validate: {
      params: _configSchema.schema.object({
        id: _configSchema.schema.string({
          minLength: 1,
          maxLength: 1_000
        })
      }, {
        unknowns: 'allow'
      })
    }
  }, router.handleLegacyErrors((0, _handle_errors.handleErrors)(async (ctx, req, res) => {
    const savedObjectsClient = ctx.core.savedObjects.client;
    const elasticsearchClient = ctx.core.elasticsearch.client.asCurrentUser;
    const [,, {
      dataViewsServiceFactory
    }] = await getStartServices();
    const dataViewsService = await dataViewsServiceFactory(savedObjectsClient, elasticsearchClient, req);
    const id = req.params.id;
    const dataView = await getDataView({
      dataViewsService,
      usageCollection,
      counterName: `${req.route.method} ${path}`,
      id
    });
    return res.ok({
      headers: {
        'content-type': 'application/json'
      },
      body: {
        [serviceKey]: dataView.toSpec()
      }
    });
  })));
};

const registerGetDataViewRoute = getDataViewRouteFactory(_constants.SPECIFIC_DATA_VIEW_PATH, _constants.SERVICE_KEY);
exports.registerGetDataViewRoute = registerGetDataViewRoute;
const registerGetDataViewRouteLegacy = getDataViewRouteFactory(_constants.SPECIFIC_DATA_VIEW_PATH_LEGACY, _constants.SERVICE_KEY_LEGACY);
exports.registerGetDataViewRouteLegacy = registerGetDataViewRouteLegacy;