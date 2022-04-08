"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FetcherTask = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _server = require("../../../core/server");

var _telemetry_config = require("../common/telemetry_config");

var _telemetry_repository = require("./telemetry_repository");

var _constants = require("../common/constants");

var _is_report_interval_expired = require("../common/is_report_interval_expired");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class FetcherTask {
  constructor(initializerContext) {
    (0, _defineProperty2.default)(this, "initialCheckDelayMs", 60 * 1000 * 5);
    (0, _defineProperty2.default)(this, "checkIntervalMs", 60 * 1000 * 60 * 12);
    (0, _defineProperty2.default)(this, "config$", void 0);
    (0, _defineProperty2.default)(this, "currentKibanaVersion", void 0);
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "intervalId", void 0);
    (0, _defineProperty2.default)(this, "lastReported", void 0);
    (0, _defineProperty2.default)(this, "isSending", false);
    (0, _defineProperty2.default)(this, "internalRepository", void 0);
    (0, _defineProperty2.default)(this, "telemetryCollectionManager", void 0);
    this.config$ = initializerContext.config.create();
    this.currentKibanaVersion = initializerContext.env.packageInfo.version;
    this.logger = initializerContext.logger.get('fetcher');
  }

  start({
    savedObjects
  }, {
    telemetryCollectionManager
  }) {
    this.internalRepository = new _server.SavedObjectsClient(savedObjects.createInternalRepository());
    this.telemetryCollectionManager = telemetryCollectionManager;
    this.intervalId = (0, _rxjs.timer)(this.initialCheckDelayMs, this.checkIntervalMs).subscribe(() => this.sendIfDue());
  }

  stop() {
    if (this.intervalId) {
      this.intervalId.unsubscribe();
    }
  }

  async sendIfDue() {
    if (this.isSending) {
      return;
    }

    let telemetryConfig;

    try {
      telemetryConfig = await this.getCurrentConfigs();
    } catch (err) {
      this.logger.warn(`Error getting telemetry configs. (${err})`);
      return;
    }

    if (!telemetryConfig || !this.shouldSendReport(telemetryConfig)) {
      return;
    }

    let clusters = [];
    this.isSending = true;

    try {
      clusters = await this.fetchTelemetry();
    } catch (err) {
      this.logger.warn(`Error fetching usage. (${err})`);
      this.isSending = false;
      return;
    }

    try {
      const {
        telemetryUrl
      } = telemetryConfig;
      await this.sendTelemetry(telemetryUrl, clusters);
      await this.updateLastReported();
    } catch (err) {
      await this.updateReportFailure(telemetryConfig);
      this.logger.warn(`Error sending telemetry usage data. (${err})`);
    }

    this.isSending = false;
  }

  async getCurrentConfigs() {
    const telemetrySavedObject = await (0, _telemetry_repository.getTelemetrySavedObject)(this.internalRepository);
    const config = await this.config$.pipe((0, _operators.take)(1)).toPromise();
    const currentKibanaVersion = this.currentKibanaVersion;
    const configTelemetrySendUsageFrom = config.sendUsageFrom;
    const allowChangingOptInStatus = config.allowChangingOptInStatus;
    const configTelemetryOptIn = typeof config.optIn === 'undefined' ? null : config.optIn;
    const telemetryUrl = (0, _telemetry_config.getTelemetryChannelEndpoint)({
      channelName: 'snapshot',
      env: config.sendUsageTo
    });
    const {
      failureCount,
      failureVersion
    } = (0, _telemetry_config.getTelemetryFailureDetails)({
      telemetrySavedObject
    });
    return {
      telemetryOptIn: (0, _telemetry_config.getTelemetryOptIn)({
        currentKibanaVersion,
        telemetrySavedObject,
        allowChangingOptInStatus,
        configTelemetryOptIn
      }),
      telemetrySendUsageFrom: (0, _telemetry_config.getTelemetrySendUsageFrom)({
        telemetrySavedObject,
        configTelemetrySendUsageFrom
      }),
      telemetryUrl,
      failureCount,
      failureVersion,
      currentVersion: currentKibanaVersion,
      lastReported: telemetrySavedObject ? telemetrySavedObject.lastReported : void 0
    };
  }

  async updateLastReported() {
    this.lastReported = Date.now();
    (0, _telemetry_repository.updateTelemetrySavedObject)(this.internalRepository, {
      reportFailureCount: 0,
      lastReported: this.lastReported
    }).catch(err => {
      err.message = `Failed to update the telemetry saved object: ${err.message}`;
      this.logger.debug(err);
    });
  }

  async updateReportFailure({
    failureCount
  }) {
    (0, _telemetry_repository.updateTelemetrySavedObject)(this.internalRepository, {
      reportFailureCount: failureCount + 1,
      reportFailureVersion: this.currentKibanaVersion
    }).catch(err => {
      err.message = `Failed to update the telemetry saved object: ${err.message}`;
      this.logger.debug(err);
    });
  }

  shouldSendReport({
    telemetryOptIn,
    telemetrySendUsageFrom,
    failureCount,
    failureVersion,
    currentVersion,
    lastReported
  }) {
    if (failureCount > 2 && failureVersion === currentVersion) {
      return false;
    }

    if (telemetryOptIn && telemetrySendUsageFrom === 'server') {
      // Check both: in-memory and SO-driven value.
      // This will avoid the server retrying over and over when it has issues with storing the state in the SO.
      if ((0, _is_report_interval_expired.isReportIntervalExpired)(this.lastReported) && (0, _is_report_interval_expired.isReportIntervalExpired)(lastReported)) {
        return true;
      }
    }

    return false;
  }

  async fetchTelemetry() {
    return await this.telemetryCollectionManager.getStats({
      unencrypted: false
    });
  }

  async sendTelemetry(telemetryUrl, payload) {
    this.logger.debug(`Sending usage stats.`);
    /**
     * send OPTIONS before sending usage data.
     * OPTIONS is less intrusive as it does not contain any payload and is used here to check if the endpoint is reachable.
     */

    await (0, _nodeFetch.default)(telemetryUrl, {
      method: 'options'
    });
    await Promise.all(payload.map(async ({
      clusterUuid,
      stats
    }) => {
      await (0, _nodeFetch.default)(telemetryUrl, {
        method: 'post',
        body: stats,
        headers: {
          'Content-Type': 'application/json',
          'X-Elastic-Stack-Version': this.currentKibanaVersion,
          'X-Elastic-Cluster-ID': clusterUuid,
          'X-Elastic-Content-Encoding': _constants.PAYLOAD_CONTENT_ENCODING
        }
      });
    }));
  }

}

exports.FetcherTask = FetcherTask;