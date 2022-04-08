"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAbortError = isAbortError;

var _elasticsearch = require("@elastic/elasticsearch");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function isAbortError(error) {
  return error instanceof _elasticsearch.errors.RequestAbortedError;
}