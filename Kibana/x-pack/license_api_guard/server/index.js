"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "License", {
  enumerable: true,
  get: function () {
    return _license.License;
  }
});
exports.plugin = plugin;

var _license = require("./license");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/** dummy plugin*/


function plugin() {
  return new class LicenseApiGuardPlugin {
    setup() {}

    start() {}

  }();
}