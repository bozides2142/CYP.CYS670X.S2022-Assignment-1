"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.KibanaUsageCollectionPlugin = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _rxjs = require("rxjs");

var _server = require("../../../core/server");

var _event_loop_delays = require("./collectors/event_loop_delays");

var _collectors = require("./collectors");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class KibanaUsageCollectionPlugin {
  constructor(initializerContext) {
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "instanceUuid", void 0);
    (0, _defineProperty2.default)(this, "savedObjectsClient", void 0);
    (0, _defineProperty2.default)(this, "uiSettingsClient", void 0);
    (0, _defineProperty2.default)(this, "metric$", void 0);
    (0, _defineProperty2.default)(this, "coreUsageData", void 0);
    (0, _defineProperty2.default)(this, "eventLoopUsageCounter", void 0);
    (0, _defineProperty2.default)(this, "pluginStop$", void 0);
    this.logger = initializerContext.logger.get();
    this.metric$ = new _rxjs.Subject();
    this.pluginStop$ = new _rxjs.Subject();
    this.instanceUuid = initializerContext.env.instanceUuid;
  }

  setup(coreSetup, {
    usageCollection
  }) {
    usageCollection.createUsageCounter('uiCounters');
    this.eventLoopUsageCounter = usageCollection.createUsageCounter('eventLoop');
    coreSetup.coreUsageData.registerUsageCounter(usageCollection.createUsageCounter('core'));
    this.registerUsageCollectors(usageCollection, coreSetup, this.metric$, this.pluginStop$, coreSetup.savedObjects.registerType.bind(coreSetup.savedObjects));
  }

  start(core) {
    if (!this.eventLoopUsageCounter) {
      throw new Error('#setup must be called first');
    }

    const {
      savedObjects,
      uiSettings
    } = core;
    this.savedObjectsClient = savedObjects.createInternalRepository([_event_loop_delays.SAVED_OBJECTS_DAILY_TYPE]);
    const savedObjectsClient = new _server.SavedObjectsClient(this.savedObjectsClient);
    this.uiSettingsClient = uiSettings.asScopedToClient(savedObjectsClient);
    core.metrics.getOpsMetrics$().subscribe(this.metric$);
    this.coreUsageData = core.coreUsageData;
    (0, _event_loop_delays.startTrackingEventLoopDelaysUsage)(this.savedObjectsClient, this.instanceUuid, this.pluginStop$.asObservable(), new _server.EventLoopDelaysMonitor());
    (0, _event_loop_delays.startTrackingEventLoopDelaysThreshold)(this.eventLoopUsageCounter, this.logger, this.pluginStop$.asObservable(), new _server.EventLoopDelaysMonitor());
  }

  stop() {
    this.metric$.complete();
    this.pluginStop$.next();
    this.pluginStop$.complete();
  }

  registerUsageCollectors(usageCollection, coreSetup, metric$, pluginStop$, registerType) {
    const kibanaIndex = coreSetup.savedObjects.getKibanaIndex();

    const getSavedObjectsClient = () => this.savedObjectsClient;

    const getUiSettingsClient = () => this.uiSettingsClient;

    const getCoreUsageDataService = () => this.coreUsageData;

    (0, _collectors.registerUiCounterSavedObjectType)(coreSetup.savedObjects);
    (0, _collectors.registerUiCountersRollups)(this.logger.get('ui-counters'), pluginStop$, getSavedObjectsClient);
    (0, _collectors.registerUiCountersUsageCollector)(usageCollection, pluginStop$);
    (0, _collectors.registerUsageCountersRollups)(this.logger.get('usage-counters-rollup'), getSavedObjectsClient);
    (0, _collectors.registerUsageCountersUsageCollector)(usageCollection);
    (0, _collectors.registerOpsStatsCollector)(usageCollection, metric$);
    (0, _collectors.registerKibanaUsageCollector)(usageCollection, kibanaIndex);
    (0, _collectors.registerSavedObjectsCountUsageCollector)(usageCollection, kibanaIndex);
    (0, _collectors.registerManagementUsageCollector)(usageCollection, getUiSettingsClient);
    (0, _collectors.registerUiMetricUsageCollector)(usageCollection, registerType, getSavedObjectsClient);
    (0, _collectors.registerApplicationUsageCollector)(this.logger.get('application-usage'), usageCollection, registerType, getSavedObjectsClient);
    (0, _collectors.registerCloudProviderUsageCollector)(usageCollection);
    (0, _collectors.registerCspCollector)(usageCollection, coreSetup.http);
    (0, _collectors.registerCoreUsageCollector)(usageCollection, getCoreUsageDataService);
    (0, _collectors.registerConfigUsageCollector)(usageCollection, getCoreUsageDataService);
    (0, _collectors.registerLocalizationUsageCollector)(usageCollection, coreSetup.i18n);
    (0, _collectors.registerEventLoopDelaysCollector)(this.logger.get('event-loop-delays'), usageCollection, registerType, getSavedObjectsClient);
  }

}

exports.KibanaUsageCollectionPlugin = KibanaUsageCollectionPlugin;