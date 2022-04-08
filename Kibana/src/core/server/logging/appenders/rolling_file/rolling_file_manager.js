"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RollingFileManager = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _fs = require("fs");

var _path = require("path");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Delegate of the {@link RollingFileAppender} used to manage the log file access
 */
class RollingFileManager {
  constructor(context) {
    (0, _defineProperty2.default)(this, "filePath", void 0);
    (0, _defineProperty2.default)(this, "outputStream", void 0);
    this.context = context;
    this.filePath = context.filePath;
  }

  write(chunk) {
    const stream = this.ensureStreamOpen();
    this.context.currentFileSize += Buffer.byteLength(chunk, 'utf8');
    stream.write(chunk);
  }

  async closeStream() {
    return new Promise(resolve => {
      if (this.outputStream === undefined) {
        return resolve();
      }

      this.outputStream.end(() => {
        this.outputStream = undefined;
        resolve();
      });
    });
  }

  ensureStreamOpen() {
    if (this.outputStream === undefined) {
      this.ensureDirectory(this.filePath);
      this.outputStream = (0, _fs.createWriteStream)(this.filePath, {
        encoding: 'utf8',
        flags: 'a'
      }); // refresh the file meta in case it was not initialized yet.

      this.context.refreshFileInfo();
    }

    return this.outputStream;
  }

  ensureDirectory(path) {
    (0, _fs.mkdirSync)((0, _path.dirname)(path), {
      recursive: true
    });
  }

}

exports.RollingFileManager = RollingFileManager;