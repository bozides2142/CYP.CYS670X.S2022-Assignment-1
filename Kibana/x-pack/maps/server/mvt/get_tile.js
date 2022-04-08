"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEsTile = getEsTile;

var _util = require("./util");

var _execution_context = require("../../common/execution_context");

var _merge_fields = require("./merge_fields");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getEsTile({
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
  abortController
}) {
  try {
    const path = `/${encodeURIComponent(index)}/_mvt/${geometryFieldName}/${z}/${x}/${y}`;
    const body = {
      grid_precision: 0,
      // no aggs
      exact_bounds: true,
      extent: 4096,
      // full resolution,
      query: requestBody.query,
      fields: (0, _merge_fields.mergeFields)([requestBody.docvalue_fields, requestBody.stored_fields], [geometryFieldName]),
      runtime_mappings: requestBody.runtime_mappings,
      track_total_hits: requestBody.size + 1
    };
    const tile = await core.executionContext.withContext((0, _execution_context.makeExecutionContext)({
      description: 'mvt:get_tile',
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