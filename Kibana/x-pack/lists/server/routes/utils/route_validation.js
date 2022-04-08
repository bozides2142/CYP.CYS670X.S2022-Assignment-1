"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildRouteValidation = void 0;

var _Either = require("fp-ts/lib/Either");

var _pipeable = require("fp-ts/lib/pipeable");

var _securitysolutionIoTsUtils = require("@kbn/securitysolution-io-ts-utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Copied from x-pack/plugins/security_solution/server/utils/build_validation/route_validation.ts
 * This really should be in @kbn/securitysolution-io-ts-utils rather than copied yet again, however, this has types
 * from a lot of places such as RouteValidationResultFactory from core/server which in turn can pull in @kbn/schema
 * which cannot work on the front end and @kbn/securitysolution-io-ts-utils works on both front and backend.
 *
 * TODO: Figure out a way to move this function into a package rather than copying it/forking it within plugins
 */


const buildRouteValidation = schema => (inputValue, validationResult) => (0, _pipeable.pipe)(schema.decode(inputValue), decoded => (0, _securitysolutionIoTsUtils.exactCheck)(inputValue, decoded), (0, _Either.fold)(errors => validationResult.badRequest((0, _securitysolutionIoTsUtils.formatErrors)(errors).join()), validatedInput => validationResult.ok(validatedInput)));

exports.buildRouteValidation = buildRouteValidation;