"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VerificationCode = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _chalk = _interopRequireDefault(require("chalk"));

var _crypto = _interopRequireDefault(require("crypto"));

var _common = require("../common");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class VerificationCode {
  constructor(logger) {
    (0, _defineProperty2.default)(this, "code", VerificationCode.generate(_common.VERIFICATION_CODE_LENGTH));
    (0, _defineProperty2.default)(this, "failedAttempts", 0);
    (0, _defineProperty2.default)(this, "maxFailedAttempts", 5);
    this.logger = logger;
  }

  get remainingAttempts() {
    return this.maxFailedAttempts - this.failedAttempts;
  }

  verify(code) {
    if (this.failedAttempts >= this.maxFailedAttempts) {
      this.logger.error('Maximum number of attempts exceeded. Restart Kibana to generate a new code and retry.');
      return false;
    }

    const highlightedCode = _chalk.default.black.bgCyanBright(` ${this.code.substr(0, 3)} ${this.code.substr(3)} `);

    if (code === undefined) {
      // eslint-disable-next-line no-console
      console.log(`

Your verification code is: ${highlightedCode}

`);
      return false;
    }

    if (code !== this.code) {
      this.failedAttempts++;
      this.logger.error(`Invalid verification code '${code}' provided. ${this.remainingAttempts} attempts left.`); // eslint-disable-next-line no-console

      console.log(`

Your verification code is: ${highlightedCode}

`);
      return false;
    }

    this.logger.debug(`Code '${code}' verified successfully`);
    this.failedAttempts = 0;
    return true;
  }
  /**
   * Returns a cryptographically secure and random 6-digit code.
   *
   * Implementation notes: `secureRandomNumber` returns a random number like `0.05505769583xxxx`. To
   * turn that into a 6 digit code we multiply it by `10^6` and result is `055057`.
   */


  static generate(length) {
    return Math.floor(secureRandomNumber() * Math.pow(10, length)).toString().padStart(length, '0');
  }

}
/**
 * Cryptographically secure equivalent of `Math.random()`.
 */


exports.VerificationCode = VerificationCode;

function secureRandomNumber() {
  return _crypto.default.randomBytes(4).readUInt32LE() / 0x100000000;
}