"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "registerApplicationUsageCollector", {
  enumerable: true,
  get: function () {
    return _application_usage.registerApplicationUsageCollector;
  }
});
Object.defineProperty(exports, "registerCloudProviderUsageCollector", {
  enumerable: true,
  get: function () {
    return _cloud.registerCloudProviderUsageCollector;
  }
});
Object.defineProperty(exports, "registerConfigUsageCollector", {
  enumerable: true,
  get: function () {
    return _config_usage.registerConfigUsageCollector;
  }
});
Object.defineProperty(exports, "registerCoreUsageCollector", {
  enumerable: true,
  get: function () {
    return _core.registerCoreUsageCollector;
  }
});
Object.defineProperty(exports, "registerCspCollector", {
  enumerable: true,
  get: function () {
    return _csp.registerCspCollector;
  }
});
Object.defineProperty(exports, "registerEventLoopDelaysCollector", {
  enumerable: true,
  get: function () {
    return _event_loop_delays.registerEventLoopDelaysCollector;
  }
});
Object.defineProperty(exports, "registerKibanaUsageCollector", {
  enumerable: true,
  get: function () {
    return _saved_objects_counts.registerKibanaUsageCollector;
  }
});
Object.defineProperty(exports, "registerLocalizationUsageCollector", {
  enumerable: true,
  get: function () {
    return _localization.registerLocalizationUsageCollector;
  }
});
Object.defineProperty(exports, "registerManagementUsageCollector", {
  enumerable: true,
  get: function () {
    return _management.registerManagementUsageCollector;
  }
});
Object.defineProperty(exports, "registerOpsStatsCollector", {
  enumerable: true,
  get: function () {
    return _ops_stats.registerOpsStatsCollector;
  }
});
Object.defineProperty(exports, "registerSavedObjectsCountUsageCollector", {
  enumerable: true,
  get: function () {
    return _saved_objects_counts.registerSavedObjectsCountUsageCollector;
  }
});
Object.defineProperty(exports, "registerUiCounterSavedObjectType", {
  enumerable: true,
  get: function () {
    return _ui_counters.registerUiCounterSavedObjectType;
  }
});
Object.defineProperty(exports, "registerUiCountersRollups", {
  enumerable: true,
  get: function () {
    return _ui_counters.registerUiCountersRollups;
  }
});
Object.defineProperty(exports, "registerUiCountersUsageCollector", {
  enumerable: true,
  get: function () {
    return _ui_counters.registerUiCountersUsageCollector;
  }
});
Object.defineProperty(exports, "registerUiMetricUsageCollector", {
  enumerable: true,
  get: function () {
    return _ui_metric.registerUiMetricUsageCollector;
  }
});
Object.defineProperty(exports, "registerUsageCountersRollups", {
  enumerable: true,
  get: function () {
    return _usage_counters.registerUsageCountersRollups;
  }
});
Object.defineProperty(exports, "registerUsageCountersUsageCollector", {
  enumerable: true,
  get: function () {
    return _usage_counters.registerUsageCountersUsageCollector;
  }
});

var _ui_metric = require("./ui_metric");

var _management = require("./management");

var _application_usage = require("./application_usage");

var _saved_objects_counts = require("./saved_objects_counts");

var _ops_stats = require("./ops_stats");

var _cloud = require("./cloud");

var _csp = require("./csp");

var _core = require("./core");

var _localization = require("./localization");

var _config_usage = require("./config_usage");

var _ui_counters = require("./ui_counters");

var _usage_counters = require("./usage_counters");

var _event_loop_delays = require("./event_loop_delays");