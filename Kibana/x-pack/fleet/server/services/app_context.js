"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.appContextService = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _rxjs = require("rxjs");

var _utils = require("@kbn/utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class AppContextService {
  constructor() {
    (0, _defineProperty2.default)(this, "encryptedSavedObjects", void 0);
    (0, _defineProperty2.default)(this, "encryptedSavedObjectsSetup", void 0);
    (0, _defineProperty2.default)(this, "data", void 0);
    (0, _defineProperty2.default)(this, "esClient", void 0);
    (0, _defineProperty2.default)(this, "securitySetup", void 0);
    (0, _defineProperty2.default)(this, "securityStart", void 0);
    (0, _defineProperty2.default)(this, "config$", void 0);
    (0, _defineProperty2.default)(this, "configSubject$", void 0);
    (0, _defineProperty2.default)(this, "savedObjects", void 0);
    (0, _defineProperty2.default)(this, "isProductionMode", false);
    (0, _defineProperty2.default)(this, "kibanaVersion", _utils.kibanaPackageJson.version);
    (0, _defineProperty2.default)(this, "kibanaBranch", _utils.kibanaPackageJson.branch);
    (0, _defineProperty2.default)(this, "cloud", void 0);
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "httpSetup", void 0);
    (0, _defineProperty2.default)(this, "externalCallbacks", new Map());
    (0, _defineProperty2.default)(this, "telemetryEventsSender", void 0);
  }

  start(appContext) {
    var _appContext$encrypted;

    this.data = appContext.data;
    this.esClient = appContext.elasticsearch.client.asInternalUser;
    this.encryptedSavedObjects = (_appContext$encrypted = appContext.encryptedSavedObjectsStart) === null || _appContext$encrypted === void 0 ? void 0 : _appContext$encrypted.getClient();
    this.encryptedSavedObjectsSetup = appContext.encryptedSavedObjectsSetup;
    this.securitySetup = appContext.securitySetup;
    this.securityStart = appContext.securityStart;
    this.savedObjects = appContext.savedObjects;
    this.isProductionMode = appContext.isProductionMode;
    this.cloud = appContext.cloud;
    this.logger = appContext.logger;
    this.kibanaVersion = appContext.kibanaVersion;
    this.kibanaBranch = appContext.kibanaBranch;
    this.httpSetup = appContext.httpSetup;
    this.telemetryEventsSender = appContext.telemetryEventsSender;

    if (appContext.config$) {
      this.config$ = appContext.config$;
      const initialValue = appContext.configInitialValue;
      this.configSubject$ = new _rxjs.BehaviorSubject(initialValue);
      this.config$.subscribe(this.configSubject$);
    }
  }

  stop() {
    this.externalCallbacks.clear();
  }

  getData() {
    if (!this.data) {
      throw new Error('Data start service not set.');
    }

    return this.data;
  }

  getEncryptedSavedObjects() {
    if (!this.encryptedSavedObjects) {
      throw new Error('Encrypted saved object start service not set.');
    }

    return this.encryptedSavedObjects;
  }

  getSecurity() {
    return this.securityStart;
  }

  getSecurityLicense() {
    return this.securitySetup.license;
  }

  getCloud() {
    return this.cloud;
  }

  getLogger() {
    if (!this.logger) {
      throw new Error('Logger not set.');
    }

    return this.logger;
  }

  getConfig() {
    var _this$configSubject$;

    return (_this$configSubject$ = this.configSubject$) === null || _this$configSubject$ === void 0 ? void 0 : _this$configSubject$.value;
  }

  getConfig$() {
    return this.config$;
  }

  getSavedObjects() {
    if (!this.savedObjects) {
      throw new Error('Saved objects start service not set.');
    }

    return this.savedObjects;
  }

  getInternalUserSOClient(request) {
    // soClient as kibana internal users, be careful on how you use it, security is not enabled
    return appContextService.getSavedObjects().getScopedClient(request, {
      excludedWrappers: ['security']
    });
  }

  getInternalUserESClient() {
    if (!this.esClient) {
      throw new Error('Elasticsearch start service not set.');
    } // soClient as kibana internal users, be careful on how you use it, security is not enabled


    return this.esClient;
  }

  getIsProductionMode() {
    return this.isProductionMode;
  }

  getHttpSetup() {
    if (!this.httpSetup) {
      throw new Error('HttpServiceSetup not set.');
    }

    return this.httpSetup;
  }

  getEncryptedSavedObjectsSetup() {
    return this.encryptedSavedObjectsSetup;
  }

  getKibanaVersion() {
    return this.kibanaVersion;
  }

  getKibanaBranch() {
    return this.kibanaBranch;
  }

  addExternalCallback(type, callback) {
    if (!this.externalCallbacks.has(type)) {
      this.externalCallbacks.set(type, new Set());
    }

    this.externalCallbacks.get(type).add(callback);
  }

  getExternalCallbacks(type) {
    if (this.externalCallbacks) {
      return this.externalCallbacks.get(type);
    }
  }

  getTelemetryEventsSender() {
    return this.telemetryEventsSender;
  }

}

const appContextService = new AppContextService();
exports.appContextService = appContextService;