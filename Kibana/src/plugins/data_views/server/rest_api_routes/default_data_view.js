"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setDefault = exports.registerManageDefaultDataViewRouteLegacy = exports.registerManageDefaultDataViewRoute = exports.getDefault = void 0;

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
const getDefault = async ({
  dataViewsService,
  usageCollection,
  counterName
}) => {
  usageCollection === null || usageCollection === void 0 ? void 0 : usageCollection.incrementCounter({
    counterName
  });
  return dataViewsService.getDefaultId();
};

exports.getDefault = getDefault;

const setDefault = async ({
  dataViewsService,
  usageCollection,
  counterName,
  newDefaultId,
  force
}) => {
  usageCollection === null || usageCollection === void 0 ? void 0 : usageCollection.incrementCounter({
    counterName
  });
  return dataViewsService.setDefault(newDefaultId, force);
};

exports.setDefault = setDefault;

const manageDefaultIndexPatternRoutesFactory = (path, serviceKey) => (router, getStartServices, usageCollection) => {
  router.get({
    path,
    validate: {}
  }, (0, _handle_errors.handleErrors)(async (ctx, req, res) => {
    const savedObjectsClient = ctx.core.savedObjects.client;
    const elasticsearchClient = ctx.core.elasticsearch.client.asCurrentUser;
    const [,, {
      dataViewsServiceFactory
    }] = await getStartServices();
    const dataViewsService = await dataViewsServiceFactory(savedObjectsClient, elasticsearchClient, req);
    const id = await getDefault({
      dataViewsService,
      usageCollection,
      counterName: `${req.route.method} ${path}`
    });
    return res.ok({
      body: {
        [`${serviceKey}_id`]: id
      }
    });
  }));
  router.post({
    path,
    validate: {
      body: _configSchema.schema.object({
        [`${serviceKey}_id`]: _configSchema.schema.nullable(_configSchema.schema.string({
          minLength: 1,
          maxLength: 1_000
        })),
        force: _configSchema.schema.boolean({
          defaultValue: false
        })
      })
    }
  }, (0, _handle_errors.handleErrors)(async (ctx, req, res) => {
    const savedObjectsClient = ctx.core.savedObjects.client;
    const elasticsearchClient = ctx.core.elasticsearch.client.asCurrentUser;
    const [,, {
      dataViewsServiceFactory
    }] = await getStartServices();
    const dataViewsService = await dataViewsServiceFactory(savedObjectsClient, elasticsearchClient, req);
    const newDefaultId = req.body[`${serviceKey}_id`];
    const force = req.body.force;
    await setDefault({
      dataViewsService,
      usageCollection,
      counterName: `${req.route.method} ${path}`,
      newDefaultId,
      force
    });
    return res.ok({
      body: {
        acknowledged: true
      }
    });
  }));
};

const registerManageDefaultDataViewRoute = manageDefaultIndexPatternRoutesFactory(`${_constants.SERVICE_PATH}/default`, _constants.SERVICE_KEY);
exports.registerManageDefaultDataViewRoute = registerManageDefaultDataViewRoute;
const registerManageDefaultDataViewRouteLegacy = manageDefaultIndexPatternRoutesFactory(`${_constants.SERVICE_PATH_LEGACY}/default`, _constants.SERVICE_KEY_LEGACY);
exports.registerManageDefaultDataViewRouteLegacy = registerManageDefaultDataViewRouteLegacy;