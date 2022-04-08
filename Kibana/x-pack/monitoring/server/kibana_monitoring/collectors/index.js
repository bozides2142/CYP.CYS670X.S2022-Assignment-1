"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "getKibanaSettings", {
  enumerable: true,
  get: function () {
    return _get_settings_collector.getKibanaSettings;
  }
});
exports.registerCollectors = registerCollectors;

var _get_settings_collector = require("./get_settings_collector");

var _get_usage_collector = require("./get_usage_collector");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerCollectors(usageCollection, config, getClient) {
  usageCollection.registerCollector((0, _get_settings_collector.getSettingsCollector)(usageCollection, config));
  usageCollection.registerCollector((0, _get_usage_collector.getMonitoringUsageCollector)(usageCollection, config, getClient));
}