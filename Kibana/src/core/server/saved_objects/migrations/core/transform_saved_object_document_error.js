"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TransformSavedObjectDocumentError = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Error thrown when saved object migrations encounter a transformation error.
 * Transformation errors happen when a transform function throws an error for an unsanitized saved object
 */
class TransformSavedObjectDocumentError extends Error {
  constructor(originalError, version) {
    super(`Migration function for version ${version} threw an error`);
    this.originalError = originalError;
    this.version = version;
    appendCauseStack(this, originalError);
  }

}

exports.TransformSavedObjectDocumentError = TransformSavedObjectDocumentError;

const appendCauseStack = (error, cause) => {
  var _error$stack, _cause$stack;

  error.stack = ((_error$stack = error.stack) !== null && _error$stack !== void 0 ? _error$stack : '') + `\nCaused by:\n${(_cause$stack = cause.stack) !== null && _cause$stack !== void 0 ? _cause$stack : cause.message}`;
};