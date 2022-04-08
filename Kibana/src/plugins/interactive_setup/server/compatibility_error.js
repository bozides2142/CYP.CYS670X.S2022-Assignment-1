"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CompatibilityError = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class CompatibilityError extends Error {
  constructor(meta) {
    super('Compatibility Error');
    this.meta = meta;
    Error.captureStackTrace(this, CompatibilityError);
    this.name = 'CompatibilityError';
    this.message = meta.message;
  }

  get elasticsearchVersion() {
    return this.meta.incompatibleNodes[0].version;
  }

  get kibanaVersion() {
    return this.meta.kibanaVersion;
  }

}

exports.CompatibilityError = CompatibilityError;