"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.plugin = exports.config = void 0;

var _configSchema = require("@kbn/config-schema");

var _plugin = require("./plugin");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
//  This exports static code and TypeScript types,
//  as well as, Kibana Platform `plugin()` initializer.


const plugin = initializerContext => {
  return new _plugin.MetricsEntitiesPlugin(initializerContext);
};

exports.plugin = plugin;
const config = {
  schema: _configSchema.schema.object({
    // This plugin is experimental and should be disabled by default.
    enabled: _configSchema.schema.boolean({
      defaultValue: false
    })
  })
};
exports.config = config;