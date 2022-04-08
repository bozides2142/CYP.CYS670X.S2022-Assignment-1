"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OpsMetricsCollector = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _collectors = require("./collectors");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class OpsMetricsCollector {
  constructor(server, opsOptions) {
    (0, _defineProperty2.default)(this, "processCollector", void 0);
    (0, _defineProperty2.default)(this, "osCollector", void 0);
    (0, _defineProperty2.default)(this, "serverCollector", void 0);
    this.processCollector = new _collectors.ProcessMetricsCollector();
    this.osCollector = new _collectors.OsMetricsCollector(opsOptions);
    this.serverCollector = new _collectors.ServerMetricsCollector(server);
  }

  async collect() {
    const [processes, os, server] = await Promise.all([this.processCollector.collect(), this.osCollector.collect(), this.serverCollector.collect()]);
    return {
      collected_at: new Date(),

      /**
       * Kibana does not yet support multi-process nodes.
       * `processes` is just an Array(1) only returning the current process's data
       *  which is why we can just use processes[0] for `process`
       */
      process: processes[0],
      processes,
      os,
      ...server
    };
  }

  reset() {
    this.processCollector.reset();
    this.osCollector.reset();
    this.serverCollector.reset();
  }

}

exports.OpsMetricsCollector = OpsMetricsCollector;