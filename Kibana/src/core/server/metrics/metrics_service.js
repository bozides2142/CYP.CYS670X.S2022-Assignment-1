"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MetricsService = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _ops_metrics_collector = require("./ops_metrics_collector");

var _ops_config = require("./ops_config");

var _logging = require("./logging");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/** @internal */
class MetricsService {
  constructor(coreContext) {
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "opsMetricsLogger", void 0);
    (0, _defineProperty2.default)(this, "metricsCollector", void 0);
    (0, _defineProperty2.default)(this, "collectInterval", void 0);
    (0, _defineProperty2.default)(this, "metrics$", new _rxjs.ReplaySubject(1));
    (0, _defineProperty2.default)(this, "service", void 0);
    this.coreContext = coreContext;
    this.logger = coreContext.logger.get('metrics');
    this.opsMetricsLogger = coreContext.logger.get('metrics', 'ops');
  }

  async setup({
    http
  }) {
    const config = await this.coreContext.configService.atPath(_ops_config.opsConfig.path).pipe((0, _operators.first)()).toPromise();
    this.metricsCollector = new _ops_metrics_collector.OpsMetricsCollector(http.server, {
      logger: this.logger,
      ...config.cGroupOverrides
    });
    await this.refreshMetrics();
    this.collectInterval = setInterval(() => {
      this.refreshMetrics();
    }, config.interval.asMilliseconds());
    const metricsObservable = this.metrics$.asObservable();
    this.service = {
      collectionInterval: config.interval.asMilliseconds(),
      getOpsMetrics$: () => metricsObservable
    };
    return this.service;
  }

  async start() {
    if (!this.service) {
      throw new Error('#setup() needs to be run first');
    }

    return this.service;
  }

  async refreshMetrics() {
    const metrics = await this.metricsCollector.collect();
    const {
      message,
      meta
    } = (0, _logging.getEcsOpsMetricsLog)(metrics);
    this.opsMetricsLogger.debug(message, meta);
    this.metricsCollector.reset();
    this.metrics$.next(metrics);
  }

  async stop() {
    if (this.collectInterval) {
      clearInterval(this.collectInterval);
    }

    this.metrics$.complete();
  }

}

exports.MetricsService = MetricsService;