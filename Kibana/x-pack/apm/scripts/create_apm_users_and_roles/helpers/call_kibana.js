"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AbortError = void 0;
exports.callKibana = callKibana;
exports.isAxiosError = isAxiosError;

var _axios = _interopRequireDefault(require("axios"));

var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function callKibana({
  elasticsearch,
  kibana,
  options
}) {
  const baseUrl = await getBaseUrl(kibana.hostname);
  const {
    username,
    password
  } = elasticsearch;
  const {
    data
  } = await _axios.default.request({ ...options,
    baseURL: baseUrl,
    auth: {
      username,
      password
    },
    headers: {
      'kbn-xsrf': 'true',
      ...options.headers
    }
  });
  return data;
}

const getBaseUrl = (0, _lodash.once)(async kibanaHostname => {
  try {
    await _axios.default.request({
      url: kibanaHostname,
      maxRedirects: 0
    });
  } catch (e) {
    if (isAxiosError(e)) {
      var _e$response, _e$response$headers;

      const location = (_e$response = e.response) === null || _e$response === void 0 ? void 0 : (_e$response$headers = _e$response.headers) === null || _e$response$headers === void 0 ? void 0 : _e$response$headers.location;
      const hasBasePath = RegExp(/^\/\w{3}$/).test(location);
      const basePath = hasBasePath ? location : '';
      return `${kibanaHostname}${basePath}`;
    }

    throw e;
  }

  return kibanaHostname;
});

function isAxiosError(e) {
  return 'isAxiosError' in e;
}

class AbortError extends Error {
  constructor(message) {
    super(message);
  }

}

exports.AbortError = AbortError;