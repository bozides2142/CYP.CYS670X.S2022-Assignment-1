"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "LICENSE_TYPE", {
  enumerable: true,
  get: function () {
    return _types.LICENSE_TYPE;
  }
});
Object.defineProperty(exports, "config", {
  enumerable: true,
  get: function () {
    return _licensing_config.config;
  }
});
exports.plugin = void 0;
Object.defineProperty(exports, "wrapRouteWithLicenseCheck", {
  enumerable: true,
  get: function () {
    return _wrap_route_with_license_check.wrapRouteWithLicenseCheck;
  }
});

var _plugin = require("./plugin");

var _types = require("../common/types");

var _licensing_config = require("./licensing_config");

var _wrap_route_with_license_check = require("./wrap_route_with_license_check");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const plugin = context => new _plugin.LicensingPlugin(context);

exports.plugin = plugin;