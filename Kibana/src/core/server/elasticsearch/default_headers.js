"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getReservedHeaders = exports.RESERVED_HEADERS = exports.PRODUCT_ORIGIN_HEADER = exports.DEFAULT_HEADERS = void 0;

var _std = require("@kbn/std");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const PRODUCT_ORIGIN_HEADER = 'x-elastic-product-origin';
exports.PRODUCT_ORIGIN_HEADER = PRODUCT_ORIGIN_HEADER;
const RESERVED_HEADERS = (0, _std.deepFreeze)([PRODUCT_ORIGIN_HEADER]);
exports.RESERVED_HEADERS = RESERVED_HEADERS;
const DEFAULT_HEADERS = (0, _std.deepFreeze)({
  // Elasticsearch uses this to identify when a request is coming from Kibana, to allow Kibana to
  // access system indices using the standard ES APIs.
  [PRODUCT_ORIGIN_HEADER]: 'kibana'
});
exports.DEFAULT_HEADERS = DEFAULT_HEADERS;

const getReservedHeaders = headerNames => {
  const reservedHeaders = [];

  for (const headerName of headerNames) {
    if (RESERVED_HEADERS.includes(headerName.toLowerCase())) {
      reservedHeaders.push(headerName);
    }
  }

  return reservedHeaders;
};

exports.getReservedHeaders = getReservedHeaders;