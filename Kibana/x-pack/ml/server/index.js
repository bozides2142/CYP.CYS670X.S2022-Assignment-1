"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "InsufficientMLCapabilities", {
  enumerable: true,
  get: function () {
    return _shared.InsufficientMLCapabilities;
  }
});
Object.defineProperty(exports, "MLPrivilegesUninitialized", {
  enumerable: true,
  get: function () {
    return _shared.MLPrivilegesUninitialized;
  }
});
Object.defineProperty(exports, "UnknownMLCapabilitiesError", {
  enumerable: true,
  get: function () {
    return _shared.UnknownMLCapabilitiesError;
  }
});
Object.defineProperty(exports, "getHistogramsForFields", {
  enumerable: true,
  get: function () {
    return _shared.getHistogramsForFields;
  }
});
exports.plugin = void 0;

var _plugin = require("./plugin");

var _shared = require("./shared");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const plugin = ctx => new _plugin.MlServerPlugin(ctx);

exports.plugin = plugin;