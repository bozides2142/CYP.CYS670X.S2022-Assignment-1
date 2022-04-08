"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initOverviewRoute = void 0;

var _runtime_types = require("../../../common/runtime_types");

var _overview_api = require("../../../common/http_api/overview_api");

var _create_search_client = require("../../lib/create_search_client");

var _get_top_nodes = require("./lib/get_top_nodes");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const initOverviewRoute = libs => {
  const {
    framework
  } = libs;
  framework.registerRoute({
    method: 'post',
    path: '/api/metrics/overview/top',
    validate: {
      body: (0, _runtime_types.createValidationFunction)(_overview_api.TopNodesRequestRT)
    }
  }, async (requestContext, request, response) => {
    const options = request.body;
    const client = (0, _create_search_client.createSearchClient)(requestContext, framework);
    const source = await libs.sources.getSourceConfiguration(requestContext.core.savedObjects.client, options.sourceId);
    const topNResponse = await (0, _get_top_nodes.queryTopNodes)(options, client, source);
    return response.ok({
      body: topNResponse
    });
  });
};

exports.initOverviewRoute = initOverviewRoute;