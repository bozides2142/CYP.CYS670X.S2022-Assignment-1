"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SavedObjectProviderRegistry = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _i18n = require("@kbn/i18n");

var _Option = require("fp-ts/lib/Option");

var _pipeable = require("fp-ts/lib/pipeable");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class SavedObjectProviderRegistry {
  constructor() {
    (0, _defineProperty2.default)(this, "providers", new Map());
    (0, _defineProperty2.default)(this, "defaultProvider", void 0);
  }

  registerDefaultProvider(provider) {
    this.defaultProvider = provider;
  }

  registerProvider(type, provider) {
    if (this.providers.has(type)) {
      throw new Error(`The Event Log has already registered a Provider for the Save Object type "${type}".`);
    }

    this.providers.set(type, provider);
  }

  getProvidersClient(request) {
    if (!this.defaultProvider) {
      throw new Error(_i18n.i18n.translate('xpack.eventLog.savedObjectProviderRegistry.getProvidersClient.noDefaultProvider', {
        defaultMessage: 'The Event Log requires a default Provider.'
      }));
    } // `scopedProviders` is a cache of providers which are scoped t othe current request.
    // The client will only instantiate a provider on-demand and it will cache each
    // one to enable the request to reuse each provider.
    // would be nice to have a simple version support in API:
    // curl -X GET "localhost:9200/my-index-000001/_mget?pretty" -H 'Content-Type: application/json' -d' { "ids" : ["1", "2"] } '


    const scopedProviders = new Map();
    const defaultGetter = this.defaultProvider(request);
    return (type, ids) => {
      const objects = ids.map(id => ({
        type,
        id
      }));
      const getter = (0, _pipeable.pipe)((0, _Option.fromNullable)(scopedProviders.get(type)), (0, _Option.getOrElse)(() => {
        const client = this.providers.has(type) ? this.providers.get(type)(request) : defaultGetter;
        scopedProviders.set(type, client);
        return client;
      }));
      return getter(objects);
    };
  }

}

exports.SavedObjectProviderRegistry = SavedObjectProviderRegistry;