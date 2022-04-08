"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DataValidationError = void 0;

var _error_with_status_code = require("../../../error_with_status_code");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class DataValidationError extends _error_with_status_code.ErrorWithStatusCode {
  constructor(reason, statusCode = 500) {
    super('Data validation failure', statusCode);
    this.reason = reason;
  }

  getReason() {
    var _this$reason;

    return (_this$reason = this.reason) !== null && _this$reason !== void 0 ? _this$reason : [];
  }

}

exports.DataValidationError = DataValidationError;