"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExtensionPointStorage = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _extension_point_storage_client = require("./extension_point_storage_client");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class ExtensionPointStorage {
  constructor(logger) {
    (0, _defineProperty2.default)(this, "store", new Map());
    (0, _defineProperty2.default)(this, "registeredFrom", new Map());
    this.logger = logger;
  }

  add(extension) {
    if (!this.store.has(extension.type)) {
      this.store.set(extension.type, new Set());
    }

    const extensionPointsForType = this.store.get(extension.type);

    if (extensionPointsForType) {
      var _Error$stack;

      extensionPointsForType.add(extension); // Capture stack trace from where this extension point was registered, so that it can be used when
      // errors occur or callbacks don't return the expected result

      const from = (_Error$stack = new Error('REGISTERED FROM:').stack) !== null && _Error$stack !== void 0 ? _Error$stack : 'REGISTERED FROM: unknown';
      this.registeredFrom.set(extension, from.substring(from.indexOf('REGISTERED FROM:')).concat('\n    ----------------------'));
    }
  }

  clear() {
    this.store.clear();
    this.registeredFrom.clear();
  }

  getExtensionRegistrationSource(extensionPoint) {
    return this.registeredFrom.get(extensionPoint);
  }

  get(extensionType) {
    const extensionDefinitions = this.store.get(extensionType);

    if (extensionDefinitions) {
      return extensionDefinitions;
    }

    return undefined;
  }
  /**
   * returns a client interface that does not expose the full set of methods available in the storage
   */


  getClient() {
    return new _extension_point_storage_client.ExtensionPointStorageClient(this, this.logger);
  }

}

exports.ExtensionPointStorage = ExtensionPointStorage;