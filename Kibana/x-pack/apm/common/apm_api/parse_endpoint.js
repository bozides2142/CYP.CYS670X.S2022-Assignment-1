"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseEndpoint = parseEndpoint;
exports.parseMethod = parseMethod;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function parseEndpoint(endpoint, pathParams = {}) {
  const [method, rawPathname] = endpoint.split(' '); // replace template variables with path params

  const pathname = Object.keys(pathParams).reduce((acc, paramName) => {
    return acc.replace(`{${paramName}}`, pathParams[paramName]);
  }, rawPathname);
  return {
    method: parseMethod(method),
    pathname
  };
}

function parseMethod(method) {
  const res = method.trim().toLowerCase();

  if (!['get', 'post', 'put', 'delete'].includes(res)) {
    throw new Error('Endpoint was not prefixed with a valid HTTP method');
  }

  return res;
}