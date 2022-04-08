"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.encode = exports.decode = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const encode = input => Buffer.from(JSON.stringify(input)).toString('base64');

exports.encode = encode;

const decode = serializedInput => JSON.parse(Buffer.from(serializedInput, 'base64').toString());

exports.decode = decode;