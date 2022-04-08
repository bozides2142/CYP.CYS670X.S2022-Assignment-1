"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBaseUrl = getBaseUrl;
exports.getChannel = getChannel;
exports.getTelemetryChannelEndpoint = getTelemetryChannelEndpoint;

var _constants = require("../constants");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function getChannel(channelName) {
  switch (channelName) {
    case 'snapshot':
      return _constants.TELEMETRY_CHANNELS.SNAPSHOT_CHANNEL;

    case 'optInStatus':
      return _constants.TELEMETRY_CHANNELS.OPT_IN_STATUS_CHANNEL;

    default:
      throw new Error(`Unknown telemetry channel ${channelName}.`);
  }
}

function getBaseUrl(env) {
  switch (env) {
    case 'prod':
      return _constants.ENDPOINT_PROD;

    case 'staging':
      return _constants.ENDPOINT_STAGING;

    default:
      throw new Error(`Unknown telemetry endpoint env ${env}.`);
  }
}

function getTelemetryChannelEndpoint({
  channelName,
  env
}) {
  const baseUrl = getBaseUrl(env);
  const channelPath = getChannel(channelName);
  return `${baseUrl}${channelPath}/${_constants.ENDPOINT_VERSION}/send`;
}