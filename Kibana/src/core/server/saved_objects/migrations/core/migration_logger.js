"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MigrationLogger = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/*
 * This file provides a helper class for ensuring that all logging
 * in the migration system is done in a fairly uniform way.
 */

/** @public */
class MigrationLogger {
  constructor(log) {
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "info", msg => this.logger.info(msg));
    (0, _defineProperty2.default)(this, "debug", msg => this.logger.debug(msg));
    (0, _defineProperty2.default)(this, "warning", msg => this.logger.warn(msg));
    (0, _defineProperty2.default)(this, "warn", msg => this.logger.warn(msg));
    (0, _defineProperty2.default)(this, "error", (msg, meta) => this.logger.error(msg, meta));
    this.logger = log;
  }

}

exports.MigrationLogger = MigrationLogger;