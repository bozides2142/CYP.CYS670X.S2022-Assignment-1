"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logDeprecatedEndpoint = exports.getWarningHeader = exports.escapeHatch = void 0;
exports.wrapError = wrapError;

var _boom = require("@hapi/boom");

var _configSchema = require("@kbn/config-schema");

var _error = require("../../common/error");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Transforms an error into the correct format for a kibana response.
 */


function wrapError(error) {
  let boom;

  if ((0, _error.isCaseError)(error)) {
    boom = error.boomify();
  } else {
    const options = {
      statusCode: (0, _error.isHTTPError)(error) ? error.statusCode : 500
    };
    boom = (0, _boom.isBoom)(error) ? error : (0, _boom.boomify)(error, options);
  }

  return {
    body: boom,
    headers: boom.output.headers,
    statusCode: boom.output.statusCode
  };
}

const escapeHatch = _configSchema.schema.object({}, {
  unknowns: 'allow'
});
/**
 * Creates a warning header with a message formatted according to RFC7234.
 * We follow the same formatting as Elasticsearch
 * https://github.com/elastic/elasticsearch/blob/5baabff6670a8ed49297488ca8cac8ec12a2078d/server/src/main/java/org/elasticsearch/common/logging/HeaderWarning.java#L55
 */


exports.escapeHatch = escapeHatch;

const getWarningHeader = (kibanaVersion, msg = 'Deprecated endpoint') => ({
  warning: `299 Kibana-${kibanaVersion} "${msg}"`
});
/**
 * Taken from
 * https://github.com/elastic/kibana/blob/ec30f2aeeb10fb64b507935e558832d3ef5abfaa/x-pack/plugins/spaces/server/usage_stats/usage_stats_client.ts#L113-L118
 */


exports.getWarningHeader = getWarningHeader;

const getIsKibanaRequest = headers => {
  // The presence of these two request headers gives us a good indication that this is a first-party request from the Kibana client.
  // We can't be 100% certain, but this is a reasonable attempt.
  return headers && headers['kbn-version'] && headers.referer;
};

const logDeprecatedEndpoint = (logger, headers, msg) => {
  if (!getIsKibanaRequest(headers)) {
    logger.warn(msg);
  }
};

exports.logDeprecatedEndpoint = logDeprecatedEndpoint;