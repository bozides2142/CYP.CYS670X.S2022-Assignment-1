"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fileUploadRoutes = fileUploadRoutes;

var _configSchema = require("@kbn/config-schema");

var _constants = require("../common/constants");

var _error_wrapper = require("./error_wrapper");

var _import_data = require("./import_data");

var _get_time_field_range = require("./get_time_field_range");

var _analyze_file = require("./analyze_file");

var _telemetry = require("./telemetry");

var _schemas = require("./schemas");

var _check_privileges = require("./check_privileges");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function importData(client, id, index, settings, mappings, ingestPipeline, data) {
  const {
    importData: importDataFunc
  } = (0, _import_data.importDataProvider)(client);
  return importDataFunc(id, index, settings, mappings, ingestPipeline, data);
}
/**
 * Routes for the file upload.
 */


function fileUploadRoutes(coreSetup, logger) {
  const router = coreSetup.http.createRouter();
  router.get({
    path: '/internal/file_upload/has_import_permission',
    validate: {
      query: _configSchema.schema.object({
        indexName: _configSchema.schema.maybe(_configSchema.schema.string()),
        checkCreateIndexPattern: _configSchema.schema.boolean(),
        checkHasManagePipeline: _configSchema.schema.boolean()
      })
    }
  }, async (context, request, response) => {
    try {
      var _pluginsStart$securit;

      const [, pluginsStart] = await coreSetup.getStartServices();
      const {
        indexName,
        checkCreateIndexPattern,
        checkHasManagePipeline
      } = request.query;
      const {
        hasImportPermission
      } = await (0, _check_privileges.checkFileUploadPrivileges)({
        authorization: (_pluginsStart$securit = pluginsStart.security) === null || _pluginsStart$securit === void 0 ? void 0 : _pluginsStart$securit.authz,
        request,
        indexName,
        checkCreateIndexPattern,
        checkHasManagePipeline
      });
      return response.ok({
        body: {
          hasImportPermission
        }
      });
    } catch (e) {
      logger.warn(`Unable to check import permission, error: ${e.message}`);
      return response.ok({
        body: {
          hasImportPermission: false
        }
      });
    }
  });
  /**
   * @apiGroup FileDataVisualizer
   *
   * @api {post} /internal/file_upload/analyze_file Analyze file data
   * @apiName AnalyzeFile
   * @apiDescription Performs analysis of the file data.
   *
   * @apiSchema (query) analyzeFileQuerySchema
   */

  router.post({
    path: '/internal/file_data_visualizer/analyze_file',
    validate: {
      body: _configSchema.schema.any(),
      query: _schemas.analyzeFileQuerySchema
    },
    options: {
      body: {
        accepts: ['text/*', 'application/json'],
        maxBytes: _constants.MAX_FILE_SIZE_BYTES
      },
      tags: ['access:fileUpload:analyzeFile']
    }
  }, async (context, request, response) => {
    try {
      const result = await (0, _analyze_file.analyzeFile)(context.core.elasticsearch.client, request.body, request.query);
      return response.ok({
        body: result
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  });
  /**
   * @apiGroup FileDataVisualizer
   *
   * @api {post} /internal/file_upload/import Import file data
   * @apiName ImportFile
   * @apiDescription Imports file data into elasticsearch index.
   *
   * @apiSchema (query) importFileQuerySchema
   * @apiSchema (body) importFileBodySchema
   */

  router.post({
    path: '/internal/file_upload/import',
    validate: {
      query: _schemas.importFileQuerySchema,
      body: _schemas.importFileBodySchema
    },
    options: {
      body: {
        accepts: ['application/json'],
        maxBytes: _constants.MAX_FILE_SIZE_BYTES
      }
    }
  }, async (context, request, response) => {
    try {
      const {
        id
      } = request.query;
      const {
        index,
        data,
        settings,
        mappings,
        ingestPipeline
      } = request.body; // `id` being `undefined` tells us that this is a new import due to create a new index.
      // follow-up import calls to just add additional data will include the `id` of the created
      // index, we'll ignore those and don't increment the counter.

      if (id === undefined) {
        await (0, _telemetry.updateTelemetry)();
      }

      const result = await importData(context.core.elasticsearch.client, id, index, settings, mappings, // @ts-expect-error
      ingestPipeline, data);
      return response.ok({
        body: result
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  });
  /**
   * @apiGroup FileDataVisualizer
   *
   * @api {post} /internal/file_upload/index_exists ES indices exists wrapper checks if index exists
   * @apiName IndexExists
   */

  router.post({
    path: '/internal/file_upload/index_exists',
    validate: {
      body: _configSchema.schema.object({
        index: _configSchema.schema.string()
      })
    }
  }, async (context, request, response) => {
    try {
      const {
        body: indexExists
      } = await context.core.elasticsearch.client.asCurrentUser.indices.exists(request.body);
      return response.ok({
        body: {
          exists: indexExists
        }
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  });
  /**
   * @apiGroup FileDataVisualizer
   *
   * @api {post} /internal/file_upload/time_field_range Get time field range
   * @apiName GetTimeFieldRange
   * @apiDescription Returns the time range for the given index and query using the specified time range.
   *
   * @apiSchema (body) getTimeFieldRangeSchema
   *
   * @apiSuccess {Object} start start of time range with epoch and string properties.
   * @apiSuccess {Object} end end of time range with epoch and string properties.
   */

  router.post({
    path: '/internal/file_upload/time_field_range',
    validate: {
      body: _configSchema.schema.object({
        /** Index or indexes for which to return the time range. */
        index: _configSchema.schema.oneOf([_configSchema.schema.string(), _configSchema.schema.arrayOf(_configSchema.schema.string())]),

        /** Name of the time field in the index. */
        timeFieldName: _configSchema.schema.string(),

        /** Query to match documents in the index(es). */
        query: _configSchema.schema.maybe(_configSchema.schema.any()),
        runtimeMappings: _configSchema.schema.maybe(_schemas.runtimeMappingsSchema)
      })
    },
    options: {
      tags: ['access:fileUpload:analyzeFile']
    }
  }, async (context, request, response) => {
    try {
      const {
        index,
        timeFieldName,
        query,
        runtimeMappings
      } = request.body;
      const resp = await (0, _get_time_field_range.getTimeFieldRange)(context.core.elasticsearch.client, index, timeFieldName, query, runtimeMappings);
      return response.ok({
        body: resp
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  });
}