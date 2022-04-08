"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cryptoFactory = cryptoFactory;

var _nodeCrypto = _interopRequireDefault(require("@elastic/node-crypto"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function cryptoFactory(encryptionKey) {
  if (typeof encryptionKey !== 'string') {
    throw new Error('Encryption Key required.');
  }

  return (0, _nodeCrypto.default)({
    encryptionKey
  });
}