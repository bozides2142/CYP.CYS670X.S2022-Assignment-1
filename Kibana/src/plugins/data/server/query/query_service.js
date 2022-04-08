"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.QueryService = void 0;

var _saved_objects = require("../saved_objects");

var _persistable_state = require("../../common/query/persistable_state");

var _routes = require("./routes");

var _route_handler_context = require("./route_handler_context");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class QueryService {
  setup(core) {
    core.savedObjects.registerType(_saved_objects.querySavedObjectType);
    core.http.registerRouteHandlerContext('savedQuery', _route_handler_context.registerSavedQueryRouteHandlerContext);
    (0, _routes.registerSavedQueryRoutes)(core);
    return {
      filterManager: {
        extract: _persistable_state.extract,
        inject: _persistable_state.inject,
        telemetry: _persistable_state.telemetry,
        getAllMigrations: _persistable_state.getAllMigrations
      }
    };
  }

  start() {}

}
/** @public */


exports.QueryService = QueryService;