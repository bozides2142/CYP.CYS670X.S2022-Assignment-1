"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ServerShortUrlClientFactory = void 0;

var _short_url_client = require("./short_url_client");

var _saved_object_short_url_storage = require("./storage/saved_object_short_url_storage");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class ServerShortUrlClientFactory {
  constructor(dependencies) {
    this.dependencies = dependencies;
  }

  get(params) {
    var _params$storage;

    const storage = (_params$storage = params.storage) !== null && _params$storage !== void 0 ? _params$storage : new _saved_object_short_url_storage.SavedObjectShortUrlStorage({
      savedObjects: params.savedObjects,
      savedObjectType: 'url'
    });
    const {
      currentVersion,
      locators
    } = this.dependencies;
    const client = new _short_url_client.ServerShortUrlClient({
      storage,
      currentVersion,
      locators
    });
    return client;
  }

}

exports.ServerShortUrlClientFactory = ServerShortUrlClientFactory;