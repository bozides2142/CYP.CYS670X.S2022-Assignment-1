"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initializeUpdateWorkpadAssetsRoute = initializeUpdateWorkpadAssetsRoute;
exports.initializeUpdateWorkpadRoute = initializeUpdateWorkpadRoute;

var _configSchema = require("@kbn/config-schema");

var _constants = require("../../../common/lib/constants");

var _workpad_schema = require("./workpad_schema");

var _ok_response = require("../ok_response");

var _catch_error_handler = require("../catch_error_handler");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const AssetsRecordSchema = _configSchema.schema.recordOf(_configSchema.schema.string(), _workpad_schema.WorkpadAssetSchema);

function initializeUpdateWorkpadRoute(deps) {
  const {
    router
  } = deps; // TODO: This route is likely deprecated and everything is using the workpad_structures
  // path instead. Investigate further.

  router.put({
    path: `${_constants.API_ROUTE_WORKPAD}/{id}`,
    validate: {
      params: _configSchema.schema.object({
        id: _configSchema.schema.string()
      }),
      body: _workpad_schema.WorkpadSchema
    },
    options: {
      body: {
        maxBytes: 26214400,
        accepts: ['application/json']
      }
    }
  }, (0, _catch_error_handler.catchErrorHandler)(async (context, request, response) => {
    await context.canvas.workpad.update(request.params.id, request.body);
    return response.ok({
      body: _ok_response.okResponse
    });
  }));
  router.put({
    path: `${_constants.API_ROUTE_WORKPAD_STRUCTURES}/{id}`,
    validate: {
      params: _configSchema.schema.object({
        id: _configSchema.schema.string()
      }),
      body: _workpad_schema.WorkpadSchema
    },
    options: {
      body: {
        maxBytes: 26214400,
        accepts: ['application/json']
      }
    }
  }, (0, _catch_error_handler.catchErrorHandler)(async (context, request, response) => {
    await context.canvas.workpad.update(request.params.id, request.body);
    return response.ok({
      body: _ok_response.okResponse
    });
  }));
}

function initializeUpdateWorkpadAssetsRoute(deps) {
  const {
    router
  } = deps;
  router.put({
    path: `${_constants.API_ROUTE_WORKPAD_ASSETS}/{id}`,
    validate: {
      params: _configSchema.schema.object({
        id: _configSchema.schema.string()
      }),
      // ToDo: Currently the validation must be a schema.object
      // Because we don't know what keys the assets will have, we have to allow
      // unknowns and then validate in the handler
      body: _configSchema.schema.object({}, {
        unknowns: 'allow'
      })
    },
    options: {
      body: {
        maxBytes: 26214400,
        accepts: ['application/json']
      }
    }
  }, async (context, request, response) => {
    const workpadAssets = {
      assets: AssetsRecordSchema.validate(request.body)
    };
    await context.canvas.workpad.update(request.params.id, workpadAssets);
    return response.ok({
      body: _ok_response.okResponse
    });
  });
}