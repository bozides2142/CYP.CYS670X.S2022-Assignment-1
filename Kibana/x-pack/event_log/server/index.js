"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "ClusterClientAdapter", {
  enumerable: true,
  get: function () {
    return _cluster_client_adapter.ClusterClientAdapter;
  }
});
Object.defineProperty(exports, "SAVED_OBJECT_REL_PRIMARY", {
  enumerable: true,
  get: function () {
    return _types.SAVED_OBJECT_REL_PRIMARY;
  }
});
exports.config = void 0;
Object.defineProperty(exports, "createReadySignal", {
  enumerable: true,
  get: function () {
    return _ready_signal.createReadySignal;
  }
});
exports.plugin = void 0;

var _types = require("./types");

var _plugin = require("./plugin");

var _cluster_client_adapter = require("./es/cluster_client_adapter");

var _ready_signal = require("./lib/ready_signal");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const config = {
  schema: _types.ConfigSchema
};
exports.config = config;

const plugin = context => new _plugin.Plugin(context);

exports.plugin = plugin;