"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  parseApiKeyFromHeaders: true,
  parseApiKey: true,
  invalidateAPIKeys: true
};
Object.defineProperty(exports, "invalidateAPIKeys", {
  enumerable: true,
  get: function () {
    return _security.invalidateAPIKeys;
  }
});
exports.parseApiKey = parseApiKey;
exports.parseApiKeyFromHeaders = parseApiKeyFromHeaders;

var _security = require("./security");

var _enrollment_api_key = require("./enrollment_api_key");

Object.keys(_enrollment_api_key).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _enrollment_api_key[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _enrollment_api_key[key];
    }
  });
});
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function parseApiKeyFromHeaders(headers) {
  const authorizationHeader = headers.authorization;

  if (!authorizationHeader) {
    throw new Error('Authorization header must be set');
  }

  if (Array.isArray(authorizationHeader)) {
    throw new Error('Authorization header must be `string` not `string[]`');
  }

  if (!authorizationHeader.startsWith('ApiKey ')) {
    throw new Error('Authorization header is malformed');
  }

  const apiKey = authorizationHeader.split(' ')[1];
  return parseApiKey(apiKey);
}

function parseApiKey(apiKey) {
  const apiKeyId = Buffer.from(apiKey, 'base64').toString('utf8').split(':')[0];
  return {
    apiKey,
    apiKeyId
  };
}