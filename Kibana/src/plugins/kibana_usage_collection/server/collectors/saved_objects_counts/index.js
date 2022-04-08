"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "registerKibanaUsageCollector", {
  enumerable: true,
  get: function () {
    return _kibana_usage_collector.registerKibanaUsageCollector;
  }
});
Object.defineProperty(exports, "registerSavedObjectsCountUsageCollector", {
  enumerable: true,
  get: function () {
    return _saved_objects_count_collector.registerSavedObjectsCountUsageCollector;
  }
});

var _kibana_usage_collector = require("./kibana_usage_collector");

var _saved_objects_count_collector = require("./saved_objects_count_collector");