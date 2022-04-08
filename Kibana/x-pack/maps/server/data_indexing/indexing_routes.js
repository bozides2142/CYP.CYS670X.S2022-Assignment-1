"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initIndexingRoutes = initIndexingRoutes;

var _configSchema = require("@kbn/config-schema");

var _constants = require("../../common/constants");

var _create_doc_source = require("./create_doc_source");

var _index_data = require("./index_data");

var _get_indexes_matching_pattern = require("./get_indexes_matching_pattern");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function initIndexingRoutes({
  router,
  logger,
  dataPlugin
}) {
  router.post({
    path: `/${_constants.INDEX_SOURCE_API_PATH}`,
    validate: {
      body: _configSchema.schema.object({
        index: _configSchema.schema.string(),
        mappings: _configSchema.schema.any()
      })
    },
    options: {
      body: {
        accepts: ['application/json']
      }
    }
  }, async (context, request, response) => {
    const {
      index,
      mappings
    } = request.body;
    const indexPatternsService = await dataPlugin.indexPatterns.indexPatternsServiceFactory(context.core.savedObjects.client, context.core.elasticsearch.client.asCurrentUser, request);
    const result = await (0, _create_doc_source.createDocSource)(index, mappings, context.core.elasticsearch.client, indexPatternsService);

    if (result.success) {
      return response.ok({
        body: result
      });
    } else {
      var _result$error;

      if (result.error) {
        logger.error(result.error);
      }

      return response.custom({
        body: result === null || result === void 0 ? void 0 : (_result$error = result.error) === null || _result$error === void 0 ? void 0 : _result$error.message,
        statusCode: 500
      });
    }
  });
  router.post({
    path: _constants.INDEX_FEATURE_PATH,
    validate: {
      body: _configSchema.schema.object({
        index: _configSchema.schema.string(),
        data: _configSchema.schema.any()
      })
    },
    options: {
      body: {
        accepts: ['application/json'],
        maxBytes: _constants.MAX_DRAWING_SIZE_BYTES
      }
    }
  }, async (context, request, response) => {
    const result = await (0, _index_data.writeDataToIndex)(request.body.index, request.body.data, context.core.elasticsearch.client.asCurrentUser);

    if (result.success) {
      return response.ok({
        body: result
      });
    } else {
      logger.error(result.error);
      return response.custom({
        body: result.error.message,
        statusCode: 500
      });
    }
  });
  router.delete({
    path: `${_constants.INDEX_FEATURE_PATH}/{featureId}`,
    validate: {
      params: _configSchema.schema.object({
        featureId: _configSchema.schema.string()
      }),
      body: _configSchema.schema.object({
        index: _configSchema.schema.string()
      })
    }
  }, async (context, request, response) => {
    try {
      const {
        body: resp
      } = await context.core.elasticsearch.client.asCurrentUser.delete({
        index: request.body.index,
        id: request.params.featureId,
        refresh: true
      }); // @ts-expect-error always false

      if (resp.result === 'Error') {
        throw resp;
      } else {
        return response.ok({
          body: {
            success: true
          }
        });
      }
    } catch (error) {
      var _error$meta;

      logger.error(error);
      const errorStatusCode = (_error$meta = error.meta) === null || _error$meta === void 0 ? void 0 : _error$meta.statusCode;

      if (errorStatusCode === 401) {
        return response.unauthorized({
          body: {
            message: 'User not authorized to delete indexed feature'
          }
        });
      } else if (errorStatusCode === 403) {
        return response.forbidden({
          body: {
            message: 'Access to delete indexed feature forbidden'
          }
        });
      } else if (errorStatusCode === 404) {
        return response.notFound({
          body: {
            message: 'Feature not found'
          }
        });
      } else {
        return response.custom({
          body: 'Unknown error deleting feature',
          statusCode: 500
        });
      }
    }
  });
  router.get({
    path: _constants.GET_MATCHING_INDEXES_PATH,
    validate: {
      query: _configSchema.schema.object({
        indexPattern: _configSchema.schema.string()
      })
    }
  }, async (context, request, response) => {
    return await (0, _get_indexes_matching_pattern.getMatchingIndexes)(request.query.indexPattern, context.core.elasticsearch.client, response, logger);
  });
  router.get({
    path: _constants.CHECK_IS_DRAWING_INDEX,
    validate: {
      query: _configSchema.schema.object({
        index: _configSchema.schema.string()
      })
    }
  }, async (context, request, response) => {
    const {
      index
    } = request.query;

    try {
      var _mappingsResp$index$m, _mappingsResp$index$m2;

      const {
        body: mappingsResp
      } = await context.core.elasticsearch.client.asCurrentUser.indices.getMapping({
        index: request.query.index
      });
      const isDrawingIndex = ((_mappingsResp$index$m = mappingsResp[index].mappings) === null || _mappingsResp$index$m === void 0 ? void 0 : (_mappingsResp$index$m2 = _mappingsResp$index$m._meta) === null || _mappingsResp$index$m2 === void 0 ? void 0 : _mappingsResp$index$m2.created_by) === _constants.MAPS_NEW_VECTOR_LAYER_META_CREATED_BY;
      return response.ok({
        body: {
          success: true,
          isDrawingIndex
        }
      });
    } catch (error) {
      // Index likely doesn't exist
      return response.ok({
        body: {
          success: false,
          error
        }
      });
    }
  });
}