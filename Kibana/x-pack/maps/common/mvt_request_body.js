"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decodeMvtResponseBody = decodeMvtResponseBody;
exports.encodeMvtResponseBody = encodeMvtResponseBody;

var _risonNode = _interopRequireDefault(require("rison-node"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function decodeMvtResponseBody(encodedRequestBody) {
  return _risonNode.default.decode(decodeURIComponent(encodedRequestBody));
}

function encodeMvtResponseBody(unencodedRequestBody) {
  return encodeURIComponent(_risonNode.default.encode(unencodedRequestBody));
}