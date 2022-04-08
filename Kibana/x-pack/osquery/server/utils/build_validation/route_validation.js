"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildRouteValidationWithExcess = exports.buildRouteValidation = void 0;

var _Either = require("fp-ts/lib/Either");

var _pipeable = require("fp-ts/lib/pipeable");

var _securitysolutionIoTsUtils = require("@kbn/securitysolution-io-ts-utils");

var _runtime_types = require("../runtime_types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const buildRouteValidation = schema => (inputValue, validationResult) => (0, _pipeable.pipe)(schema.decode(inputValue), decoded => (0, _securitysolutionIoTsUtils.exactCheck)(inputValue, decoded), (0, _Either.fold)(errors => validationResult.badRequest((0, _securitysolutionIoTsUtils.formatErrors)(errors).join()), validatedInput => validationResult.ok(validatedInput)));

exports.buildRouteValidation = buildRouteValidation;

const buildRouteValidationWithExcess = schema => (inputValue, validationResult) => (0, _pipeable.pipe)((0, _runtime_types.excess)(schema).decode(inputValue), (0, _Either.fold)(errors => validationResult.badRequest((0, _securitysolutionIoTsUtils.formatErrors)(errors).join()), validatedInput => validationResult.ok(validatedInput)));

exports.buildRouteValidationWithExcess = buildRouteValidationWithExcess;