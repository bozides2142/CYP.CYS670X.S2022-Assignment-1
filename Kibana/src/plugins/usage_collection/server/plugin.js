"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UsageCollectionPlugin = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _collector = require("./collector");

var _routes = require("./routes");

var _usage_counters = require("./usage_counters");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class UsageCollectionPlugin {
  constructor(initializerContext) {
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "savedObjects", void 0);
    (0, _defineProperty2.default)(this, "usageCountersService", void 0);
    this.initializerContext = initializerContext;
    this.logger = this.initializerContext.logger.get();
  }

  setup(core) {
    const config = this.initializerContext.config.get();
    const kibanaIndex = core.savedObjects.getKibanaIndex();
    const collectorSet = new _collector.CollectorSet({
      logger: this.logger.get('usage-collection', 'collector-set'),
      maximumWaitTimeForAllCollectorsInS: config.maximumWaitTimeForAllCollectorsInS
    });
    this.usageCountersService = new _usage_counters.UsageCountersService({
      logger: this.logger.get('usage-collection', 'usage-counters-service'),
      retryCount: config.usageCounters.retryCount,
      bufferDurationMs: config.usageCounters.bufferDuration.asMilliseconds()
    });
    const {
      createUsageCounter,
      getUsageCounterByType
    } = this.usageCountersService.setup(core);
    const uiCountersUsageCounter = createUsageCounter('uiCounter');
    const router = core.http.createRouter();
    (0, _routes.setupRoutes)({
      router,
      uiCountersUsageCounter,
      getSavedObjects: () => this.savedObjects,
      collectorSet,
      config: {
        allowAnonymous: core.status.isStatusPageAnonymous(),
        kibanaIndex,
        kibanaVersion: this.initializerContext.env.packageInfo.version,
        server: core.http.getServerInfo(),
        uuid: this.initializerContext.env.instanceUuid
      },
      metrics: core.metrics,
      overallStatus$: core.status.overall$
    });
    return {
      bulkFetch: collectorSet.bulkFetch,
      getCollectorByType: collectorSet.getCollectorByType,
      makeStatsCollector: collectorSet.makeStatsCollector,
      makeUsageCollector: collectorSet.makeUsageCollector,
      registerCollector: collectorSet.registerCollector,
      toApiFieldNames: collectorSet.toApiFieldNames,
      toObject: collectorSet.toObject,
      createUsageCounter,
      getUsageCounterByType
    };
  }

  start({
    savedObjects
  }) {
    this.logger.debug('Starting plugin');
    const config = this.initializerContext.config.get();

    if (!this.usageCountersService) {
      throw new Error('plugin setup must be called first.');
    }

    this.savedObjects = savedObjects.createInternalRepository();

    if (config.usageCounters.enabled) {
      this.usageCountersService.start({
        savedObjects
      });
    } else {
      // call stop() to complete observers.
      this.usageCountersService.stop();
    }
  }

  stop() {
    var _this$usageCountersSe;

    this.logger.debug('Stopping plugin');
    (_this$usageCountersSe = this.usageCountersService) === null || _this$usageCountersSe === void 0 ? void 0 : _this$usageCountersSe.stop();
  }

}

exports.UsageCollectionPlugin = UsageCollectionPlugin;