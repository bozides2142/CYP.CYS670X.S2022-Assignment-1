"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initMVTRoutes = initMVTRoutes;

var _configSchema = require("@kbn/config-schema");

var _constants = require("../../common/constants");

var _mvt_request_body = require("../../common/mvt_request_body");

var _get_tile = require("./get_tile");

var _get_grid_tile = require("./get_grid_tile");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const CACHE_TIMEOUT_SECONDS = 60 * 60;

function initMVTRoutes({
  router,
  logger,
  core
}) {
  router.get({
    path: `${_constants.API_ROOT_PATH}/${_constants.MVT_GETTILE_API_PATH}/{z}/{x}/{y}.pbf`,
    validate: {
      params: _configSchema.schema.object({
        x: _configSchema.schema.number(),
        y: _configSchema.schema.number(),
        z: _configSchema.schema.number()
      }),
      query: _configSchema.schema.object({
        geometryFieldName: _configSchema.schema.string(),
        requestBody: _configSchema.schema.string(),
        index: _configSchema.schema.string(),
        token: _configSchema.schema.maybe(_configSchema.schema.string())
      })
    }
  }, async (context, request, response) => {
    const {
      query,
      params
    } = request;
    const abortController = makeAbortController(request);
    const gzippedTile = await (0, _get_tile.getEsTile)({
      url: `${_constants.API_ROOT_PATH}/${_constants.MVT_GETTILE_API_PATH}/{z}/{x}/{y}.pbf`,
      core,
      logger,
      context,
      geometryFieldName: query.geometryFieldName,
      x: parseInt(params.x, 10),
      y: parseInt(params.y, 10),
      z: parseInt(params.z, 10),
      index: query.index,
      requestBody: (0, _mvt_request_body.decodeMvtResponseBody)(query.requestBody),
      abortController
    });
    return sendResponse(response, gzippedTile);
  });
  router.get({
    path: `${_constants.API_ROOT_PATH}/${_constants.MVT_GETGRIDTILE_API_PATH}/{z}/{x}/{y}.pbf`,
    validate: {
      params: _configSchema.schema.object({
        x: _configSchema.schema.number(),
        y: _configSchema.schema.number(),
        z: _configSchema.schema.number()
      }),
      query: _configSchema.schema.object({
        geometryFieldName: _configSchema.schema.string(),
        requestBody: _configSchema.schema.string(),
        index: _configSchema.schema.string(),
        requestType: _configSchema.schema.string(),
        token: _configSchema.schema.maybe(_configSchema.schema.string()),
        gridPrecision: _configSchema.schema.number()
      })
    }
  }, async (context, request, response) => {
    const {
      query,
      params
    } = request;
    const abortController = makeAbortController(request);
    const gzipTileStream = await (0, _get_grid_tile.getEsGridTile)({
      url: `${_constants.API_ROOT_PATH}/${_constants.MVT_GETGRIDTILE_API_PATH}/{z}/{x}/{y}.pbf`,
      core,
      logger,
      context,
      geometryFieldName: query.geometryFieldName,
      x: parseInt(params.x, 10),
      y: parseInt(params.y, 10),
      z: parseInt(params.z, 10),
      index: query.index,
      requestBody: (0, _mvt_request_body.decodeMvtResponseBody)(query.requestBody),
      requestType: query.requestType,
      gridPrecision: parseInt(query.gridPrecision, 10),
      abortController
    });
    return sendResponse(response, gzipTileStream);
  });
}

function sendResponse(response, gzipTileStream) {
  const cacheControl = `public, max-age=${CACHE_TIMEOUT_SECONDS}`;
  const lastModified = `${new Date().toUTCString()}`;

  if (gzipTileStream) {
    return response.ok({
      body: gzipTileStream,
      headers: {
        'content-disposition': 'inline',
        'content-encoding': 'gzip',
        'Content-Type': 'application/x-protobuf',
        'Cache-Control': cacheControl,
        'Last-Modified': lastModified
      }
    });
  } else {
    return response.ok({
      headers: {
        'content-length': `0`,
        'content-disposition': 'inline',
        'Content-Type': 'application/x-protobuf',
        'Cache-Control': cacheControl,
        'Last-Modified': lastModified
      }
    });
  }
}

function makeAbortController(request) {
  const abortController = new AbortController();
  request.events.aborted$.subscribe(() => {
    abortController.abort();
  });
  return abortController;
}