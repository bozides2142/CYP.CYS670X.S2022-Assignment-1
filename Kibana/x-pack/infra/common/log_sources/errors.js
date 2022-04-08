"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ResolveLogSourceConfigurationError = exports.PatchLogSourceConfigurationError = exports.FetchLogSourceStatusError = exports.FetchLogSourceConfigurationError = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/* eslint-disable max-classes-per-file */

class ResolveLogSourceConfigurationError extends Error {
  constructor(message, cause) {
    super(message);
    this.cause = cause;
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = 'ResolveLogSourceConfigurationError';
  }

}

exports.ResolveLogSourceConfigurationError = ResolveLogSourceConfigurationError;

class FetchLogSourceConfigurationError extends Error {
  constructor(message, cause) {
    super(message);
    this.cause = cause;
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = 'FetchLogSourceConfigurationError';
  }

}

exports.FetchLogSourceConfigurationError = FetchLogSourceConfigurationError;

class FetchLogSourceStatusError extends Error {
  constructor(message, cause) {
    super(message);
    this.cause = cause;
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = 'FetchLogSourceStatusError';
  }

}

exports.FetchLogSourceStatusError = FetchLogSourceStatusError;

class PatchLogSourceConfigurationError extends Error {
  constructor(message, cause) {
    super(message);
    this.cause = cause;
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = 'PatchLogSourceConfigurationError';
  }

}

exports.PatchLogSourceConfigurationError = PatchLogSourceConfigurationError;