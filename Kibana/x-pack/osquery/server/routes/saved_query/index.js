"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initSavedQueryRoutes = void 0;

var _create_saved_query_route = require("./create_saved_query_route");

var _delete_saved_query_route = require("./delete_saved_query_route");

var _find_saved_query_route = require("./find_saved_query_route");

var _read_saved_query_route = require("./read_saved_query_route");

var _update_saved_query_route = require("./update_saved_query_route");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const initSavedQueryRoutes = (router, context) => {
  (0, _create_saved_query_route.createSavedQueryRoute)(router, context);
  (0, _delete_saved_query_route.deleteSavedQueryRoute)(router);
  (0, _find_saved_query_route.findSavedQueryRoute)(router);
  (0, _read_saved_query_route.readSavedQueryRoute)(router);
  (0, _update_saved_query_route.updateSavedQueryRoute)(router, context);
};

exports.initSavedQueryRoutes = initSavedQueryRoutes;