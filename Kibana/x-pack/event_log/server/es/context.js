"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createEsContext = createEsContext;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _names = require("./names");

var _init = require("./init");

var _cluster_client_adapter = require("./cluster_client_adapter");

var _ready_signal = require("../lib/ready_signal");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function createEsContext(params) {
  return new EsContextImpl(params);
}

class EsContextImpl {
  constructor(params) {
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "esNames", void 0);
    (0, _defineProperty2.default)(this, "esAdapter", void 0);
    (0, _defineProperty2.default)(this, "readySignal", void 0);
    (0, _defineProperty2.default)(this, "initialized", void 0);
    this.logger = params.logger;
    this.esNames = (0, _names.getEsNames)(params.indexNameRoot, params.kibanaVersion);
    this.readySignal = (0, _ready_signal.createReadySignal)();
    this.initialized = false;
    this.esAdapter = new _cluster_client_adapter.ClusterClientAdapter({
      logger: params.logger,
      elasticsearchClientPromise: params.elasticsearchClientPromise,
      wait: () => this.readySignal.wait()
    });
  }

  initialize() {
    // only run the initialization method once
    if (this.initialized) return;
    this.initialized = true;
    this.logger.debug('initializing EsContext');
    setImmediate(async () => {
      try {
        const success = await this._initialize();
        this.logger.debug(`readySignal.signal(${success})`);
        this.readySignal.signal(success);
      } catch (err) {
        this.logger.debug('readySignal.signal(false)');
        this.readySignal.signal(false);
      }
    });
  }

  async shutdown() {
    await this.esAdapter.shutdown();
  } // waits till the ES initialization is done, returns true if it was successful,
  // false if it was not successful


  async waitTillReady() {
    return await this.readySignal.wait();
  }

  async _initialize() {
    return await (0, _init.initializeEs)(this);
  }

}