"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerUrlServiceRoutes = void 0;

var _register_create_route = require("./short_urls/register_create_route");

var _register_get_route = require("./short_urls/register_get_route");

var _register_delete_route = require("./short_urls/register_delete_route");

var _register_resolve_route = require("./short_urls/register_resolve_route");

var _register_goto_route = require("./short_urls/register_goto_route");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const registerUrlServiceRoutes = (core, router, url) => {
  (0, _register_create_route.registerCreateRoute)(router, url);
  (0, _register_get_route.registerGetRoute)(router, url);
  (0, _register_delete_route.registerDeleteRoute)(router, url);
  (0, _register_resolve_route.registerResolveRoute)(router, url);
  (0, _register_goto_route.registerGotoRoute)(router, core);
};

exports.registerUrlServiceRoutes = registerUrlServiceRoutes;