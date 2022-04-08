"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EventLogService = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _event_logger = require("./event_logger");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// note that clusterClient may be null, indicating we can't write to ES


class EventLogService {
  constructor({
    config,
    esContext,
    kibanaUUID,
    systemLogger,
    savedObjectProviderRegistry,
    kibanaVersion
  }) {
    (0, _defineProperty2.default)(this, "config", void 0);
    (0, _defineProperty2.default)(this, "esContext", void 0);
    (0, _defineProperty2.default)(this, "systemLogger", void 0);
    (0, _defineProperty2.default)(this, "registeredProviderActions", void 0);
    (0, _defineProperty2.default)(this, "savedObjectProviderRegistry", void 0);
    (0, _defineProperty2.default)(this, "kibanaVersion", void 0);
    (0, _defineProperty2.default)(this, "kibanaUUID", void 0);
    this.config = config;
    this.esContext = esContext;
    this.kibanaUUID = kibanaUUID;
    this.systemLogger = systemLogger;
    this.registeredProviderActions = new Map();
    this.savedObjectProviderRegistry = savedObjectProviderRegistry;
    this.kibanaVersion = kibanaVersion;
  }

  isLoggingEntries() {
    return this.config.logEntries;
  }

  isIndexingEntries() {
    return this.config.indexEntries;
  }

  registerProviderActions(provider, actions) {
    if (actions.length === 0) {
      throw new Error(`actions parameter must not be empty for provider: "${provider}"`);
    }

    if (this.registeredProviderActions.has(provider)) {
      throw new Error(`provider already registered: "${provider}"`);
    }

    this.registeredProviderActions.set(provider, new Set(actions));
  }

  isProviderActionRegistered(provider, action) {
    const actions = this.registeredProviderActions.get(provider);
    if (actions == null) return false;
    if (actions.has(action)) return true;
    return false;
  }

  getProviderActions() {
    return new Map(this.registeredProviderActions.entries());
  }

  registerSavedObjectProvider(type, provider) {
    return this.savedObjectProviderRegistry.registerProvider(type, provider);
  }

  async isEsContextReady() {
    return await this.esContext.waitTillReady();
  }

  getIndexPattern() {
    return this.esContext.esNames.indexPattern;
  }

  getLogger(initialProperties) {
    return new _event_logger.EventLogger({
      esContext: this.esContext,
      eventLogService: this,
      initialProperties,
      systemLogger: this.systemLogger
    });
  }

}

exports.EventLogService = EventLogService;