"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RollingFileContext = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _fs = require("fs");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Context shared between the rolling file manager, policy and strategy.
 */
class RollingFileContext {
  constructor(filePath) {
    (0, _defineProperty2.default)(this, "currentFileSize", 0);
    (0, _defineProperty2.default)(this, "currentFileTime", 0);
    this.filePath = filePath;
  }
  /**
   * The size of the currently opened file.
   */


  refreshFileInfo() {
    try {
      const {
        birthtime,
        size
      } = (0, _fs.statSync)(this.filePath);
      this.currentFileTime = birthtime.getTime();
      this.currentFileSize = size;
    } catch (e) {
      if (e.code !== 'ENOENT') {
        // eslint-disable-next-line no-console
        console.error('[RollingFileAppender] error accessing the log file', e);
      }

      this.currentFileTime = Date.now();
      this.currentFileSize = 0;
    }
  }

}

exports.RollingFileContext = RollingFileContext;