"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerComponentTemplateRoutes = registerComponentTemplateRoutes;

var _register_get_route = require("./register_get_route");

var _register_create_route = require("./register_create_route");

var _register_update_route = require("./register_update_route");

var _register_delete_route = require("./register_delete_route");

var _register_privileges_route = require("./register_privileges_route");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerComponentTemplateRoutes(dependencies) {
  (0, _register_get_route.registerGetAllRoute)(dependencies);
  (0, _register_create_route.registerCreateRoute)(dependencies);
  (0, _register_update_route.registerUpdateRoute)(dependencies);
  (0, _register_delete_route.registerDeleteRoute)(dependencies);
  (0, _register_privileges_route.registerPrivilegesRoute)(dependencies);
}