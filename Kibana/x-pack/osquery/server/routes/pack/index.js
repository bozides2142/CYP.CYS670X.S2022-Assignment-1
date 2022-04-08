"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initPackRoutes = void 0;

var _create_pack_route = require("./create_pack_route");

var _delete_pack_route = require("./delete_pack_route");

var _find_pack_route = require("./find_pack_route");

var _read_pack_route = require("./read_pack_route");

var _update_pack_route = require("./update_pack_route");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const initPackRoutes = (router, context) => {
  (0, _create_pack_route.createPackRoute)(router, context);
  (0, _delete_pack_route.deletePackRoute)(router, context);
  (0, _find_pack_route.findPackRoute)(router, context);
  (0, _read_pack_route.readPackRoute)(router, context);
  (0, _update_pack_route.updatePackRoute)(router, context);
};

exports.initPackRoutes = initPackRoutes;