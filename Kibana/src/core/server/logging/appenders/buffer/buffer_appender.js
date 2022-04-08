"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BufferAppender = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Simple appender that just buffers `LogRecord` instances it receives. It is a *reserved* appender
 * that can't be set via configuration file.
 * @internal
 */
class BufferAppender {
  constructor() {
    (0, _defineProperty2.default)(this, "buffer", []);
  }

  /**
   * Appends new `LogRecord` to the buffer.
   * @param record `LogRecord` instance to add to the buffer.
   */
  append(record) {
    this.buffer.push(record);
  }
  /**
   * Clears buffer and returns all records that it had.
   */


  flush() {
    return this.buffer.splice(0, this.buffer.length);
  }
  /**
   * Disposes `BufferAppender` and clears internal `LogRecord` buffer.
   */


  async dispose() {
    this.flush();
  }

}

exports.BufferAppender = BufferAppender;