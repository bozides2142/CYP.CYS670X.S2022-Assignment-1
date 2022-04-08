"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRequestHash = createRequestHash;
exports.isSearchSessionExpired = isSearchSessionExpired;

var _crypto = require("crypto");

var _jsonStableStringify = _interopRequireDefault(require("json-stable-stringify"));

var _moment = _interopRequireDefault(require("moment"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Generate the hash for this request so that, in the future, this hash can be used to look up
 * existing search IDs for this request. Ignores the `preference` parameter since it generally won't
 * match from one request to another identical request.
 */


function createRequestHash(keys) {
  const {
    preference,
    ...params
  } = keys;
  return (0, _crypto.createHash)(`sha256`).update((0, _jsonStableStringify.default)(params)).digest('hex');
}

function isSearchSessionExpired(session) {
  return (0, _moment.default)(session.attributes.expires).isBefore((0, _moment.default)());
}