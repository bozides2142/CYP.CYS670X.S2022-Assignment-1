"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Globals = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _url = _interopRequireDefault(require("url"));

var _mb_safe_query = require("./lib/mb_safe_query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const keyStoreData = {};

const getKeyStoreValue = (key, storeValueMethod) => {
  const value = keyStoreData[key];

  if ((value === undefined || value == null) && typeof storeValueMethod === 'function') {
    keyStoreData[key] = storeValueMethod();
  }

  return keyStoreData[key];
};

class Globals {
  static init(options) {
    var _setupPlugins$cloud;

    const {
      coreSetup,
      setupPlugins,
      config,
      getLogger
    } = options;

    const getLegacyClusterShim = async (client, endpoint, params) => await (0, _mb_safe_query.mbSafeQuery)(async () => {
      const endpointMap = {
        search: p => client.search(p),
        msearch: p => client.msearch(p),
        'transport.request': p => client.transport.request(p),
        'cluster.getSettings': p => client.cluster.getSettings(p),
        'cluster.putSettings': p => client.cluster.putSettings(p)
      };
      const {
        body
      } = await endpointMap[endpoint](params);
      return body;
    });

    const {
      protocol,
      hostname,
      port
    } = coreSetup.http.getServerInfo();
    const pathname = coreSetup.http.basePath.serverBasePath;
    Globals._app = {
      url: _url.default.format({
        protocol,
        hostname,
        port,
        pathname
      }),
      isCloud: ((_setupPlugins$cloud = setupPlugins.cloud) === null || _setupPlugins$cloud === void 0 ? void 0 : _setupPlugins$cloud.isCloudEnabled) || false,
      config,
      getLogger,
      getKeyStoreValue,
      getLegacyClusterShim
    };
  }

  static get app() {
    if (!Globals._app) {
      throw new Error('Stack Monitoring: App globals needs to be initiated with Globals.init(...) before use');
    }

    return Globals._app;
  }

  static stop() {}

}

exports.Globals = Globals;
(0, _defineProperty2.default)(Globals, "_app", void 0);