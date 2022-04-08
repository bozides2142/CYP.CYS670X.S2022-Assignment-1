"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LevelLogger = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const trimStr = toTrim => {
  return typeof toTrim === 'string' ? toTrim.trim() : toTrim;
};

class LevelLogger {
  constructor(logger, tags) {
    (0, _defineProperty2.default)(this, "_logger", void 0);
    (0, _defineProperty2.default)(this, "_tags", void 0);
    (0, _defineProperty2.default)(this, "warning", void 0);
    this._logger = logger;
    this._tags = tags || [];
    /*
     * This shortcut provides maintenance convenience: Reporting code has been
     * using both .warn and .warning
     */

    this.warning = this.warn.bind(this);
  }

  getLogger(tags) {
    return this._logger.get(...this._tags, ...tags);
  }

  error(err, tags = []) {
    this.getLogger(tags).error(err);
  }

  warn(msg, tags = []) {
    this.getLogger(tags).warn(msg);
  } // only "debug" logging supports the LogMeta for now...


  debug(msg, tags = [], meta) {
    this.getLogger(tags).debug(msg, meta);
  }

  trace(msg, tags = []) {
    this.getLogger(tags).trace(msg);
  }

  info(msg, tags = []) {
    this.getLogger(tags).info(trimStr(msg));
  }

  clone(tags) {
    return new LevelLogger(this._logger, [...this._tags, ...tags]);
  }

}

exports.LevelLogger = LevelLogger;