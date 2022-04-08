"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EventLogClientService = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _event_log_client = require("./event_log_client");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// note that clusterClient may be null, indicating we can't write to ES


class EventLogClientService {
  constructor({
    esContext,
    savedObjectProviderRegistry,
    spacesService
  }) {
    (0, _defineProperty2.default)(this, "esContext", void 0);
    (0, _defineProperty2.default)(this, "savedObjectProviderRegistry", void 0);
    (0, _defineProperty2.default)(this, "spacesService", void 0);
    this.esContext = esContext;
    this.savedObjectProviderRegistry = savedObjectProviderRegistry;
    this.spacesService = spacesService;
  }

  getClient(request) {
    return new _event_log_client.EventLogClient({
      esContext: this.esContext,
      savedObjectGetter: this.savedObjectProviderRegistry.getProvidersClient(request),
      spacesService: this.spacesService,
      request
    });
  }

}

exports.EventLogClientService = EventLogClientService;