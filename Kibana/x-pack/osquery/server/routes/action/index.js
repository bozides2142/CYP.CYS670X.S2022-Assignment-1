"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initActionRoutes = void 0;

var _create_action_route = require("./create_action_route");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const initActionRoutes = (router, context) => {
  (0, _create_action_route.createActionRoute)(router, context);
};

exports.initActionRoutes = initActionRoutes;