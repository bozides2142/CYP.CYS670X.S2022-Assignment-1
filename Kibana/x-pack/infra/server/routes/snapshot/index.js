"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initSnapshotRoute = void 0;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _configSchema = require("@kbn/config-schema");

var _pipeable = require("fp-ts/lib/pipeable");

var _Either = require("fp-ts/lib/Either");

var _function = require("fp-ts/lib/function");

var _usage_collector = require("../../usage/usage_collector");

var _snapshot_api = require("../../../common/http_api/snapshot_api");

var _runtime_types = require("../../../common/runtime_types");

var _create_search_client = require("../../lib/create_search_client");

var _get_nodes = require("./lib/get_nodes");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const escapeHatch = _configSchema.schema.object({}, {
  unknowns: 'allow'
});

const initSnapshotRoute = libs => {
  const {
    framework,
    handleEsError
  } = libs;
  framework.registerRoute({
    method: 'post',
    path: '/api/metrics/snapshot',
    validate: {
      body: escapeHatch
    }
  }, async (requestContext, request, response) => {
    const snapshotRequest = (0, _pipeable.pipe)(_snapshot_api.SnapshotRequestRT.decode(request.body), (0, _Either.fold)((0, _runtime_types.throwErrors)(_boom.default.badRequest), _function.identity));
    const source = await libs.sources.getSourceConfiguration(requestContext.core.savedObjects.client, snapshotRequest.sourceId);
    const compositeSize = libs.configuration.inventory.compositeSize;
    const logQueryFields = await libs.getLogQueryFields(snapshotRequest.sourceId, requestContext.core.savedObjects.client, requestContext.core.elasticsearch.client.asCurrentUser).catch(() => undefined);

    _usage_collector.UsageCollector.countNode(snapshotRequest.nodeType);

    const client = (0, _create_search_client.createSearchClient)(requestContext, framework);

    try {
      const snapshotResponse = await (0, _get_nodes.getNodes)(client, snapshotRequest, source, compositeSize, logQueryFields);
      return response.ok({
        body: _snapshot_api.SnapshotNodeResponseRT.encode(snapshotResponse)
      });
    } catch (err) {
      return handleEsError({
        error: err,
        response
      });
    }
  });
};

exports.initSnapshotRoute = initSnapshotRoute;