"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VerificationService = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _utils = require("@kbn/utils");

var _errors = require("./errors");

var _verification_code = require("./verification_code");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class VerificationService {
  constructor(logger) {
    (0, _defineProperty2.default)(this, "fileName", void 0);
    this.logger = logger;
    this.fileName = _path.default.join((0, _utils.getDataPath)(), 'verification_code');
  }

  setup() {
    const verificationCode = new _verification_code.VerificationCode(this.logger);

    try {
      _fs.default.writeFileSync(this.fileName, verificationCode.code);

      this.logger.debug(`Successfully wrote verification code to ${this.fileName}`);
      return verificationCode;
    } catch (error) {
      this.logger.error(`Failed to write verification code to ${this.fileName}: ${(0, _errors.getDetailedErrorMessage)(error)}.`);
    }
  }

  stop() {
    try {
      _fs.default.unlinkSync(this.fileName);

      this.logger.debug(`Successfully removed ${this.fileName}`);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        this.logger.error(`Failed to remove ${this.fileName}: ${(0, _errors.getDetailedErrorMessage)(error)}.`);
      }
    }
  }

}

exports.VerificationService = VerificationService;