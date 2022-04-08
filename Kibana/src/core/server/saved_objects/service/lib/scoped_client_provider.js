"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SavedObjectsClientProvider = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _priority_collection = require("./priority_collection");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Provider for the Scoped Saved Objects Client.
 *
 * @internal
 */
class SavedObjectsClientProvider {
  constructor({
    defaultClientFactory,
    typeRegistry
  }) {
    (0, _defineProperty2.default)(this, "_wrapperFactories", new _priority_collection.PriorityCollection());
    (0, _defineProperty2.default)(this, "_clientFactory", void 0);
    (0, _defineProperty2.default)(this, "_originalClientFactory", void 0);
    (0, _defineProperty2.default)(this, "_typeRegistry", void 0);
    this._originalClientFactory = this._clientFactory = defaultClientFactory;
    this._typeRegistry = typeRegistry;
  }

  addClientWrapperFactory(priority, id, factory) {
    if (this._wrapperFactories.has(entry => entry.id === id)) {
      throw new Error(`wrapper factory with id ${id} is already defined`);
    }

    this._wrapperFactories.add(priority, {
      id,
      factory
    });
  }

  setClientFactory(customClientFactory) {
    if (this._clientFactory !== this._originalClientFactory) {
      throw new Error(`custom client factory is already set, unable to replace the current one`);
    }

    this._clientFactory = customClientFactory;
  }

  getClient(request, {
    includedHiddenTypes,
    excludedWrappers = []
  } = {}) {
    const client = this._clientFactory({
      request,
      includedHiddenTypes
    });

    return this._wrapperFactories.toPrioritizedArray().reduceRight((clientToWrap, {
      id,
      factory
    }) => {
      if (excludedWrappers.includes(id)) {
        return clientToWrap;
      }

      return factory({
        request,
        client: clientToWrap,
        typeRegistry: this._typeRegistry
      });
    }, client);
  }

}

exports.SavedObjectsClientProvider = SavedObjectsClientProvider;