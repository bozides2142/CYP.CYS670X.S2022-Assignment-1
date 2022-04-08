"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._legacyBuildProcessorFunction = _legacyBuildProcessorFunction;
exports.buildProcessorFunction = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/** @deprecated - this method will be removed after replacing in for new one. **/
function _legacyBuildProcessorFunction(chain, ...args) {
  return chain.reduceRight((next, fn) => fn(...args)(next), doc => doc);
}

const buildProcessorFunction = (chain, args) => chain.reduceRight((next, fn) => fn(args)(next), doc => doc);

exports.buildProcessorFunction = buildProcessorFunction;