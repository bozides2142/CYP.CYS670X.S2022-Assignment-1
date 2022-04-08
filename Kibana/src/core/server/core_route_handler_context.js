"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CoreRouteHandlerContext = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classPrivateFieldSet2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldSet"));

var _classPrivateFieldGet2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldGet"));

function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }

function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }

var _client = /*#__PURE__*/new WeakMap();

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
// eslint-disable-next-line max-classes-per-file
class CoreElasticsearchRouteHandlerContext {
  constructor(elasticsearchStart, request) {
    _classPrivateFieldInitSpec(this, _client, {
      writable: true,
      value: void 0
    });

    this.elasticsearchStart = elasticsearchStart;
    this.request = request;
  }

  get client() {
    if ((0, _classPrivateFieldGet2.default)(this, _client) == null) {
      (0, _classPrivateFieldSet2.default)(this, _client, this.elasticsearchStart.client.asScoped(this.request));
    }

    return (0, _classPrivateFieldGet2.default)(this, _client);
  }

}

var _scopedSavedObjectsClient = /*#__PURE__*/new WeakMap();

var _typeRegistry = /*#__PURE__*/new WeakMap();

class CoreSavedObjectsRouteHandlerContext {
  constructor(savedObjectsStart, request) {
    _classPrivateFieldInitSpec(this, _scopedSavedObjectsClient, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _typeRegistry, {
      writable: true,
      value: void 0
    });

    (0, _defineProperty2.default)(this, "getClient", options => {
      if (!options) return this.client;
      return this.savedObjectsStart.getScopedClient(this.request, options);
    });
    (0, _defineProperty2.default)(this, "getExporter", client => {
      return this.savedObjectsStart.createExporter(client);
    });
    (0, _defineProperty2.default)(this, "getImporter", client => {
      return this.savedObjectsStart.createImporter(client);
    });
    this.savedObjectsStart = savedObjectsStart;
    this.request = request;
  }

  get client() {
    if ((0, _classPrivateFieldGet2.default)(this, _scopedSavedObjectsClient) == null) {
      (0, _classPrivateFieldSet2.default)(this, _scopedSavedObjectsClient, this.savedObjectsStart.getScopedClient(this.request));
    }

    return (0, _classPrivateFieldGet2.default)(this, _scopedSavedObjectsClient);
  }

  get typeRegistry() {
    if ((0, _classPrivateFieldGet2.default)(this, _typeRegistry) == null) {
      (0, _classPrivateFieldSet2.default)(this, _typeRegistry, this.savedObjectsStart.getTypeRegistry());
    }

    return (0, _classPrivateFieldGet2.default)(this, _typeRegistry);
  }

}

var _client2 = /*#__PURE__*/new WeakMap();

class CoreUiSettingsRouteHandlerContext {
  constructor(uiSettingsStart, savedObjectsRouterHandlerContext) {
    _classPrivateFieldInitSpec(this, _client2, {
      writable: true,
      value: void 0
    });

    this.uiSettingsStart = uiSettingsStart;
    this.savedObjectsRouterHandlerContext = savedObjectsRouterHandlerContext;
  }

  get client() {
    if ((0, _classPrivateFieldGet2.default)(this, _client2) == null) {
      (0, _classPrivateFieldSet2.default)(this, _client2, this.uiSettingsStart.asScopedToClient(this.savedObjectsRouterHandlerContext.client));
    }

    return (0, _classPrivateFieldGet2.default)(this, _client2);
  }

}

var _client3 = /*#__PURE__*/new WeakMap();

class CoreDeprecationsRouteHandlerContext {
  constructor(deprecationsStart, elasticsearchRouterHandlerContext, savedObjectsRouterHandlerContext) {
    _classPrivateFieldInitSpec(this, _client3, {
      writable: true,
      value: void 0
    });

    this.deprecationsStart = deprecationsStart;
    this.elasticsearchRouterHandlerContext = elasticsearchRouterHandlerContext;
    this.savedObjectsRouterHandlerContext = savedObjectsRouterHandlerContext;
  }

  get client() {
    if ((0, _classPrivateFieldGet2.default)(this, _client3) == null) {
      (0, _classPrivateFieldSet2.default)(this, _client3, this.deprecationsStart.asScopedToClient(this.elasticsearchRouterHandlerContext.client, this.savedObjectsRouterHandlerContext.client));
    }

    return (0, _classPrivateFieldGet2.default)(this, _client3);
  }

}

class CoreRouteHandlerContext {
  constructor(coreStart, request) {
    (0, _defineProperty2.default)(this, "elasticsearch", void 0);
    (0, _defineProperty2.default)(this, "savedObjects", void 0);
    (0, _defineProperty2.default)(this, "uiSettings", void 0);
    (0, _defineProperty2.default)(this, "deprecations", void 0);
    this.coreStart = coreStart;
    this.request = request;
    this.elasticsearch = new CoreElasticsearchRouteHandlerContext(this.coreStart.elasticsearch, this.request);
    this.savedObjects = new CoreSavedObjectsRouteHandlerContext(this.coreStart.savedObjects, this.request);
    this.uiSettings = new CoreUiSettingsRouteHandlerContext(this.coreStart.uiSettings, this.savedObjects);
    this.deprecations = new CoreDeprecationsRouteHandlerContext(this.coreStart.deprecations, this.elasticsearch, this.savedObjects);
  }

}

exports.CoreRouteHandlerContext = CoreRouteHandlerContext;