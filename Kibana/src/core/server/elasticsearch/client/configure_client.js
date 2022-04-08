"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configureClient = void 0;

var _elasticsearch = require("@elastic/elasticsearch");

var _client_config = require("./client_config");

var _log_query_and_deprecation = require("./log_query_and_deprecation");

var _create_transport = require("./create_transport");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const noop = () => undefined;

const configureClient = (config, {
  logger,
  type,
  scoped = false,
  getExecutionContext = noop
}) => {
  const clientOptions = (0, _client_config.parseClientOptions)(config, scoped);
  const KibanaTransport = (0, _create_transport.createTransport)({
    getExecutionContext
  });
  const client = new _elasticsearch.Client({ ...clientOptions,
    Transport: KibanaTransport,
    Connection: _elasticsearch.HttpConnection
  });
  (0, _log_query_and_deprecation.instrumentEsQueryAndDeprecationLogger)({
    logger,
    client,
    type
  });
  return client;
};

exports.configureClient = configureClient;