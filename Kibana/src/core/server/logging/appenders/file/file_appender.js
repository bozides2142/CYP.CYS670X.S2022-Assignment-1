"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FileAppender = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _configSchema = require("@kbn/config-schema");

var _fs = require("fs");

var _path = require("path");

var _layouts = require("../../layouts/layouts");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Appender that formats all the `LogRecord` instances it receives and writes them to the specified file.
 * @internal
 */
class FileAppender {
  /**
   * Writable file stream to write formatted `LogRecord` to.
   */

  /**
   * Creates FileAppender instance with specified layout and file path.
   * @param layout Instance of `Layout` sub-class responsible for `LogRecord` formatting.
   * @param path Path to the file where log records should be stored.
   */
  constructor(layout, path) {
    (0, _defineProperty2.default)(this, "outputStream", void 0);
    this.layout = layout;
    this.path = path;
  }
  /**
   * Formats specified `record` and writes them to the specified file.
   * @param record `LogRecord` instance to be logged.
   */


  append(record) {
    if (this.outputStream === undefined) {
      this.ensureDirectory(this.path);
      this.outputStream = (0, _fs.createWriteStream)(this.path, {
        encoding: 'utf8',
        flags: 'a'
      });
    }

    this.outputStream.write(`${this.layout.format(record)}\n`);
  }
  /**
   * Disposes `FileAppender`. Waits for the underlying file stream to be completely flushed and closed.
   */


  async dispose() {
    await new Promise(resolve => {
      if (this.outputStream === undefined) {
        return resolve();
      }

      const outputStream = this.outputStream;
      this.outputStream = undefined;
      outputStream.end(() => {
        resolve();
      });
    });
  }

  ensureDirectory(path) {
    (0, _fs.mkdirSync)((0, _path.dirname)(path), {
      recursive: true
    });
  }

}

exports.FileAppender = FileAppender;
(0, _defineProperty2.default)(FileAppender, "configSchema", _configSchema.schema.object({
  type: _configSchema.schema.literal('file'),
  layout: _layouts.Layouts.configSchema,
  fileName: _configSchema.schema.string()
}));