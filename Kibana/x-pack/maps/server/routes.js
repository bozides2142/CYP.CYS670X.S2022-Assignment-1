"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initRoutes = initRoutes;

var _configSchema = require("@kbn/config-schema");

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _constants = require("../common/constants");

var _get_index_pattern_settings = require("./lib/get_index_pattern_settings");

var _mvt_routes = require("./mvt/mvt_routes");

var _indexing_routes = require("./data_indexing/indexing_routes");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function initRoutes(coreSetup, logger) {
  const router = coreSetup.http.createRouter();
  const [coreStart, {
    data: dataPlugin
  }] = await coreSetup.getStartServices();
  router.get({
    path: `/${_constants.FONTS_API_PATH}/{fontstack}/{range}`,
    validate: {
      params: _configSchema.schema.object({
        fontstack: _configSchema.schema.string(),
        range: _configSchema.schema.string()
      })
    }
  }, (context, request, response) => {
    const range = _path.default.normalize(request.params.range);

    const rootPath = _path.default.resolve(__dirname, 'fonts', 'open_sans');

    const fontPath = _path.default.resolve(rootPath, `${range}.pbf`);

    return !fontPath.startsWith(rootPath) ? response.notFound() : new Promise(resolve => {
      _fs.default.readFile(fontPath, (error, data) => {
        if (error) {
          resolve(response.notFound());
        } else {
          resolve(response.ok({
            body: data
          }));
        }
      });
    });
  });
  router.get({
    path: `/${_constants.INDEX_SETTINGS_API_PATH}`,
    validate: {
      query: _configSchema.schema.object({
        indexPatternTitle: _configSchema.schema.string()
      })
    }
  }, async (context, request, response) => {
    const {
      query
    } = request;

    if (!query.indexPatternTitle) {
      logger.warn(`Required query parameter 'indexPatternTitle' not provided.`);
      return response.custom({
        body: `Required query parameter 'indexPatternTitle' not provided.`,
        statusCode: 400
      });
    }

    try {
      const resp = await context.core.elasticsearch.client.asCurrentUser.indices.getSettings({
        index: query.indexPatternTitle
      });
      const indexPatternSettings = (0, _get_index_pattern_settings.getIndexPatternSettings)(resp.body);
      return response.ok({
        body: indexPatternSettings
      });
    } catch (error) {
      logger.warn(`Cannot load index settings for data view '${query.indexPatternTitle}', error: ${error.message}.`);
      return response.custom({
        body: 'Error loading index settings',
        statusCode: 400
      });
    }
  });
  (0, _mvt_routes.initMVTRoutes)({
    router,
    logger,
    core: coreStart
  });
  (0, _indexing_routes.initIndexingRoutes)({
    router,
    logger,
    dataPlugin
  });
}