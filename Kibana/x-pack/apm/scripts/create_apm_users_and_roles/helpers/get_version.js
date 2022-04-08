"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getKibanaVersion = getKibanaVersion;

var _call_kibana = require("./call_kibana");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getKibanaVersion({
  elasticsearch,
  kibana
}) {
  var _e$response, _e$config$auth, _e$config$auth2;

  try {
    const res = await (0, _call_kibana.callKibana)({
      elasticsearch,
      kibana,
      options: {
        method: 'GET',
        url: `/api/status`
      }
    });
    return res.version.number;
  } catch (e) {
    if ((0, _call_kibana.isAxiosError)(e)) {
      switch ((_e$response = e.response) === null || _e$response === void 0 ? void 0 : _e$response.status) {
        case 401:
          throw new _call_kibana.AbortError(`Could not access Kibana with the provided credentials. Username: "${(_e$config$auth = e.config.auth) === null || _e$config$auth === void 0 ? void 0 : _e$config$auth.username}". Password: "${(_e$config$auth2 = e.config.auth) === null || _e$config$auth2 === void 0 ? void 0 : _e$config$auth2.password}"`);

        case 404:
          throw new _call_kibana.AbortError(`Could not get version on ${e.config.url} (Code: 404)`);

        default:
          throw new _call_kibana.AbortError(`Cannot access Kibana on ${e.config.baseURL}. Please specify Kibana with: "--kibana-url <url>"`);
      }
    }

    throw e;
  }
}