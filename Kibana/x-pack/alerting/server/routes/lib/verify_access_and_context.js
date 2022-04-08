"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verifyAccessAndContext = void 0;

var _lib = require("../../lib");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const verifyAccessAndContext = (licenseState, handler) => {
  return async (context, request, response) => {
    (0, _lib.verifyApiAccess)(licenseState);

    if (!context.alerting) {
      return response.badRequest({
        body: 'RouteHandlerContext is not registered for alerting'
      });
    }

    try {
      return await handler(context, request, response);
    } catch (e) {
      if ((0, _lib.isErrorThatHandlesItsOwnResponse)(e)) {
        return e.sendResponse(response);
      }

      throw e;
    }
  };
};

exports.verifyAccessAndContext = verifyAccessAndContext;