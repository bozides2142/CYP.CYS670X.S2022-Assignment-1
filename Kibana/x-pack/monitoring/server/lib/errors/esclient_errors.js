"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleESClientError = handleESClientError;
exports.isESClientError = isESClientError;

var _elasticsearch = require("@elastic/elasticsearch");

var _boom = require("@hapi/boom");

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 * Check if the given error message is a known "safe" type of error
 * in which case we want to give the status as 503 and show the error message.
 *
 * This is necessary because Boom's default status code is 500, and has
 * behavior to suppress the original message to the client for security
 * reasons.
 */


const mapTypeMessage = {
  ConnectionError: _i18n.i18n.translate('xpack.monitoring.errors.connectionErrorMessage', {
    defaultMessage: 'Connection error: Check the Elasticsearch Monitoring cluster network connection and refer to the Kibana logs for more information.'
  }),
  NoLivingConnectionsError: _i18n.i18n.translate('xpack.monitoring.errors.noLivingConnectionsErrorMessage', {
    defaultMessage: 'No living connections: Check the Elasticsearch Monitoring cluster network connection and refer to the Kibana logs for more information.'
  }),
  TimeoutError: _i18n.i18n.translate('xpack.monitoring.errors.TimeoutErrorMessage', {
    defaultMessage: 'Request timeout: Check the Elasticsearch Monitoring cluster network connection or the load level of the nodes.'
  })
};

function isESClientError(err) {
  if (err instanceof _elasticsearch.errors.ElasticsearchClientError === false) return false;
  const knownTypes = Object.keys(mapTypeMessage);
  return knownTypes.includes(err.constructor.name);
}

function handleESClientError(err) {
  err.message = mapTypeMessage[err.constructor.name];
  return (0, _boom.boomify)(err, {
    statusCode: 503
  });
}