"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStatusCode = void 0;
exports.handleError = handleError;

var _boom = require("@hapi/boom");

var _elasticsearch = require("@elastic/elasticsearch");

var _custom_errors = require("./custom_errors");

var _auth_errors = require("./auth_errors");

var _esclient_errors = require("./esclient_errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getStatusCode = err => {
  return (0, _boom.isBoom)(err) ? err.output.statusCode : err instanceof _elasticsearch.errors.ResponseError ? err.statusCode : undefined;
};

exports.getStatusCode = getStatusCode;

function handleError(err, req) {
  if (req) {
    req.logger.error(err);
  } // handle auth errors


  if ((0, _auth_errors.isAuthError)(err)) {
    return (0, _auth_errors.handleAuthError)(err);
  } // handle custom Monitoring errors


  if ((0, _custom_errors.isCustomError)(err)) {
    return (0, _custom_errors.handleCustomError)(err);
  } // handle certain EsClientError errors


  if ((0, _esclient_errors.isESClientError)(err)) {
    return (0, _esclient_errors.handleESClientError)(err);
  }

  if ((0, _boom.isBoom)(err)) {
    return err;
  }

  const statusCode = getStatusCode(err); // wrap the error; defaults to statusCode = 500 if statusCode is undefined

  return (0, _boom.boomify)(err, {
    statusCode,
    message: err.message
  });
}