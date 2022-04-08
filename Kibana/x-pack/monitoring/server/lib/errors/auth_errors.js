"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleAuthError = handleAuthError;
exports.isAuthError = isAuthError;

var _boom = require("@hapi/boom");

var _i18n = require("@kbn/i18n");

var _handle_error = require("./handle_error");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function isAuthError(err) {
  const statusCode = (0, _handle_error.getStatusCode)(err);
  return statusCode === 401 || statusCode === 403;
}

function handleAuthError(err) {
  const statusCode = (0, _handle_error.getStatusCode)(err);
  let message;
  /* 401 is changed to 403 because in user perception, they HAVE provided
   * credentials for the API.
   * They should see the same message whether they're logged in but
   * insufficient permissions, or they're login is valid for the production
   * connection but not the monitoring connection
   */

  if (statusCode === 401) {
    message = _i18n.i18n.translate('xpack.monitoring.errors.invalidAuthErrorMessage', {
      defaultMessage: 'Invalid authentication for monitoring cluster'
    });
  } else {
    message = _i18n.i18n.translate('xpack.monitoring.errors.insufficientUserErrorMessage', {
      defaultMessage: 'Insufficient user permissions for monitoring data'
    });
  }

  return (0, _boom.forbidden)(message);
}