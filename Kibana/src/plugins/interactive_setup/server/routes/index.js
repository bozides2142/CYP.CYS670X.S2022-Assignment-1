"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineRoutes = defineRoutes;

var _configure = require("./configure");

var _enroll = require("./enroll");

var _ping = require("./ping");

var _status = require("./status");

var _verify = require("./verify");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function defineRoutes(params) {
  (0, _configure.defineConfigureRoute)(params);
  (0, _enroll.defineEnrollRoutes)(params);
  (0, _ping.definePingRoute)(params);
  (0, _verify.defineVerifyRoute)(params);
  (0, _status.defineStatusRoute)(params);
}