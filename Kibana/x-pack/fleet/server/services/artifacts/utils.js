"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isElasticsearchItemNotFoundError = void 0;

var _errors = require("../../errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const isElasticsearchItemNotFoundError = error => {
  return (0, _errors.isESClientError)(error) && error.meta.statusCode === 404 && error.meta.body.found === false;
};

exports.isElasticsearchItemNotFoundError = isElasticsearchItemNotFoundError;