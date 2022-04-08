"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineRoutes = void 0;

var _action = require("./action");

var _saved_query = require("./saved_query");

var _status = require("./status");

var _fleet_wrapper = require("./fleet_wrapper");

var _pack = require("./pack");

var _privileges_check = require("./privileges_check");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const defineRoutes = (router, context) => {
  (0, _action.initActionRoutes)(router, context);
  (0, _status.initStatusRoutes)(router, context);
  (0, _pack.initPackRoutes)(router, context);
  (0, _fleet_wrapper.initFleetWrapperRoutes)(router, context);
  (0, _privileges_check.initPrivilegesCheckRoutes)(router, context);
  (0, _saved_query.initSavedQueryRoutes)(router, context);
};

exports.defineRoutes = defineRoutes;