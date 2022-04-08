"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "EncryptionError", {
  enumerable: true,
  get: function () {
    return _crypto.EncryptionError;
  }
});
Object.defineProperty(exports, "EncryptionErrorOperation", {
  enumerable: true,
  get: function () {
    return _crypto.EncryptionErrorOperation;
  }
});
exports.plugin = exports.config = void 0;

var _config = require("./config");

var _plugin = require("./plugin");

var _crypto = require("./crypto");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const config = {
  schema: _config.ConfigSchema
};
exports.config = config;

const plugin = initializerContext => new _plugin.EncryptedSavedObjectsPlugin(initializerContext);

exports.plugin = plugin;