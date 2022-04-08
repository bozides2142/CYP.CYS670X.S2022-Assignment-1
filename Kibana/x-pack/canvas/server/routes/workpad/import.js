"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initializeImportWorkpadRoute = initializeImportWorkpadRoute;

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


const createRequestBodySchema = _workpad_schema.ImportedWorkpadSchema;

function initializeImportWorkpadRoute(deps) {
  const {
    router
  } = deps;
  router.post({
    path: `${_constants.API_ROUTE_WORKPAD_IMPORT}`,
    validate: {
      body: createRequestBodySchema
    },
    options: {
      body: {
        maxBytes: 26214400,
        accepts: ['application/json']
      }
    }
  }, (0, _catch_error_handler.catchErrorHandler)(async (context, request, response) => {
    const workpad = request.body;
    const createdObject = await context.canvas.workpad.import(workpad);
    return response.ok({
      body: { ..._ok_response.okResponse,
        id: createdObject.id
      }
    });
  }));
}