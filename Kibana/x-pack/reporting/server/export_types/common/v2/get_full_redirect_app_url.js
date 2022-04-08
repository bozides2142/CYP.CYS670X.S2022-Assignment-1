"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFullRedirectAppUrl = getFullRedirectAppUrl;

var _url = require("url");

var _constants = require("../../../../common/constants");

var _build_kibana_path = require("../../../../common/build_kibana_path");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getFullRedirectAppUrl(config, spaceId, forceNow) {
  const [basePath, protocol, hostname, port] = [config.kbnConfig.get('server', 'basePath'), config.get('kibanaServer', 'protocol'), config.get('kibanaServer', 'hostname'), config.get('kibanaServer', 'port')];
  const path = (0, _build_kibana_path.buildKibanaPath)({
    basePath,
    spaceId,
    appPath: (0, _constants.getRedirectAppPath)()
  });
  return (0, _url.format)({
    protocol,
    hostname,
    port,
    pathname: path,
    query: forceNow ? {
      forceNow
    } : undefined
  });
}