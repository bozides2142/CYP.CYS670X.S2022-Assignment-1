"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTelemetryTaskConfigs = createTelemetryTaskConfigs;

var _packs = require("./packs");

var _saved_queries = require("./saved_queries");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function createTelemetryTaskConfigs() {
  return [(0, _packs.createTelemetryPacksTaskConfig)(), (0, _saved_queries.createTelemetrySavedQueriesTaskConfig)()];
}