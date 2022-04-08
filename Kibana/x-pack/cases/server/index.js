"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "CasesClient", {
  enumerable: true,
  get: function () {
    return _client.CasesClient;
  }
});
exports.plugin = exports.config = void 0;

var _client = require("./client");

var _config = require("./config");

var _plugin = require("./plugin");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const config = {
  schema: _config.ConfigSchema,
  exposeToBrowser: {
    markdownPlugins: true
  },
  deprecations: ({
    renameFromRoot
  }) => [renameFromRoot('xpack.case.enabled', 'xpack.cases.enabled', {
    level: 'critical'
  })]
};
exports.config = config;

const plugin = initializerContext => new _plugin.CasePlugin(initializerContext);

exports.plugin = plugin;