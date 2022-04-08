"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEsGridTile = getEsGridTile;

var _constants = require("../../common/constants");

var _util = require("./util");

var _execution_context = require("../../common/execution_context");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getEsGridTile({
  url,
  core,
  logger,
  context,
  index,
  geometryFieldName,
  x,
  y,
  z,
  requestBody = {},
  requestType = _constants.RENDER_AS.POINT,
  gridPrecision,
  abortController
}) {
  try {
    const path = `/${encodeURIComponent(index)}/_mvt/${geometryFieldName}/${z}/${x}/${y}`;
    const body = {
      size: 0,
      // no hits
      grid_precision: gridPrecision,
      exact_bounds: false,
      extent: 4096,
      // full resolution,
      query: requestBody.query,
      grid_type: requestType === _constants.RENDER_AS.GRID ? 'grid' : 'centroid',
      aggs: requestBody.aggs,
      fields: requestBody.fields,
      runtime_mappings: requestBody.runtime_mappings
    };
    const tile = await core.executionContext.withContext((0, _execution_context.makeExecutionContext)({
      description: 'mvt:get_grid_tile',
      url
    }), async () => {
      return await context.core.elasticsearch.client.asCurrentUser.transport.request({
        method: 'GET',
        path,
        body
      }, {
        signal: abortController.signal,
        headers: {
          'Accept-Encoding': 'gzip'
        },
        asStream: true
      });
    });
    return tile.body;
  } catch (e) {
    if (!(0, _util.isAbortError)(e)) {
      // These are often circuit breaking exceptions
      // Should return a tile with some error message
      logger.warn(`Cannot generate ES-grid-tile for ${z}/${x}/${y}: ${e.message}`);
    }

    return null;
  }
}