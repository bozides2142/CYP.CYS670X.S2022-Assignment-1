"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatSearchParams = formatSearchParams;

var _lzString = require("lz-string");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function formatSearchParams(opts, {
  lzCompress
} = {}) {
  const searchParams = new URLSearchParams();
  searchParams.set('l', opts.id);
  searchParams.set('v', opts.version);
  const json = JSON.stringify(opts.params);

  if (lzCompress) {
    const compressed = (0, _lzString.compressToBase64)(json);
    searchParams.set('lz', compressed);
  } else {
    searchParams.set('p', JSON.stringify(opts.params));
  }

  return searchParams;
}