"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dataVisualizerRoutes = dataVisualizerRoutes;

var _error_wrapper = require("../client/error_wrapper");

var _data_visualizer = require("../models/data_visualizer");

var _data_visualizer_schema = require("./schemas/data_visualizer_schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getHistogramsForFields(client, indexPattern, query, fields, samplerShardSize, runtimeMappings) {
  const dv = new _data_visualizer.DataVisualizer(client);
  return dv.getHistogramsForFields(indexPattern, query, fields, samplerShardSize, runtimeMappings);
}
/**
 * Routes for the index data visualizer.
 */


function dataVisualizerRoutes({
  router,
  routeGuard
}) {
  /**
   * @apiGroup DataVisualizer
   *
   * @api {post} /api/ml/data_visualizer/get_field_histograms/:indexPattern Get histograms for fields
   * @apiName GetHistogramsForFields
   * @apiDescription Returns the histograms on a list fields in the specified index pattern.
   *
   * @apiSchema (params) indexPatternSchema
   * @apiSchema (body) dataVisualizerFieldHistogramsSchema
   *
   * @apiSuccess {Object} fieldName histograms by field, keyed on the name of the field.
   */
  router.post({
    path: '/api/ml/data_visualizer/get_field_histograms/{indexPattern}',
    validate: {
      params: _data_visualizer_schema.indexPatternSchema,
      body: _data_visualizer_schema.dataVisualizerFieldHistogramsSchema
    },
    options: {
      tags: ['access:ml:canAccessML']
    }
  }, routeGuard.basicLicenseAPIGuard(async ({
    client,
    request,
    response
  }) => {
    try {
      const {
        params: {
          indexPattern
        },
        body: {
          query,
          fields,
          samplerShardSize,
          runtimeMappings
        }
      } = request;
      const results = await getHistogramsForFields(client, indexPattern, query, fields, samplerShardSize, runtimeMappings);
      return response.ok({
        body: results
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));
}