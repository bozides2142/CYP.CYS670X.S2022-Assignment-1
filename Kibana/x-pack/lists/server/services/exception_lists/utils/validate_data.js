"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateData = void 0;

var _pipeable = require("fp-ts/pipeable");

var _Either = require("fp-ts/Either");

var _securitysolutionIoTsUtils = require("@kbn/securitysolution-io-ts-utils");

var _errors = require("./errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Validates that some data is valid by using an `io-ts` schema as the validator.
 * Returns either `undefined` if the data is valid, or a `DataValidationError`, which includes
 * a `reason` property with the errors encountered
 * @param validator
 * @param data
 */


const validateData = (validator, data) => {
  return (0, _pipeable.pipe)(validator.decode(data), decoded => (0, _securitysolutionIoTsUtils.exactCheck)(data, decoded), (0, _Either.fold)(errors => {
    const errorStrings = (0, _securitysolutionIoTsUtils.formatErrors)(errors);
    return new _errors.DataValidationError(errorStrings, 400);
  }, () => undefined));
};

exports.validateData = validateData;