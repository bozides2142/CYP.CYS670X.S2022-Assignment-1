"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MonitoringLicenseError = exports.MonitoringCustomError = void 0;
exports.handleCustomError = handleCustomError;
exports.isCustomError = isCustomError;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _i18n = require("@kbn/i18n");

var _boom = require("@hapi/boom");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/* eslint-disable max-classes-per-file */


class MonitoringCustomError extends Error {
  constructor(message) {
    super(message);
    (0, _defineProperty2.default)(this, "description", void 0);
    this.name = this.constructor.name; // for stack traces
  }

}

exports.MonitoringCustomError = MonitoringCustomError;

class MonitoringLicenseError extends MonitoringCustomError {
  constructor(clusterId) {
    super();
    (0, _defineProperty2.default)(this, "description", void 0);
    this.message = _i18n.i18n.translate('xpack.monitoring.errors.monitoringLicenseErrorTitle', {
      defaultMessage: 'Monitoring License Error'
    });
    this.description = _i18n.i18n.translate('xpack.monitoring.errors.monitoringLicenseErrorDescription', {
      defaultMessage: "Could not find license information for cluster = '{clusterId}'. " + "Please check the cluster's master node server logs for errors or warnings.",
      values: {
        clusterId
      }
    });
  }

}

exports.MonitoringLicenseError = MonitoringLicenseError;

function isCustomError(err) {
  if (err instanceof MonitoringCustomError) {
    return true;
  }
}

function handleCustomError(err) {
  err.message = err.message + ': ' + err.description;
  return (0, _boom.boomify)(err, {
    statusCode: 503
  });
}