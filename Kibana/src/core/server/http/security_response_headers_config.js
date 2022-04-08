"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseRawSecurityResponseHeadersConfig = parseRawSecurityResponseHeadersConfig;
exports.securityResponseHeadersSchema = void 0;

var _configSchema = require("@kbn/config-schema");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const securityResponseHeadersSchema = _configSchema.schema.object({
  strictTransportSecurity: _configSchema.schema.oneOf([_configSchema.schema.string(), _configSchema.schema.literal(null)], {
    // See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
    defaultValue: null
  }),
  xContentTypeOptions: _configSchema.schema.oneOf([_configSchema.schema.literal('nosniff'), _configSchema.schema.literal(null)], {
    // See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
    defaultValue: 'nosniff'
  }),
  referrerPolicy: _configSchema.schema.oneOf( // See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
  [_configSchema.schema.literal('no-referrer'), _configSchema.schema.literal('no-referrer-when-downgrade'), _configSchema.schema.literal('origin'), _configSchema.schema.literal('origin-when-cross-origin'), _configSchema.schema.literal('same-origin'), _configSchema.schema.literal('strict-origin'), _configSchema.schema.literal('strict-origin-when-cross-origin'), _configSchema.schema.literal('unsafe-url'), _configSchema.schema.literal(null)], {
    defaultValue: 'no-referrer-when-downgrade'
  }),
  permissionsPolicy: _configSchema.schema.oneOf([_configSchema.schema.string(), _configSchema.schema.literal(null)], {
    // See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy
    // Note: Feature-Policy is superseded by Permissions-Policy; the link above is temporary until MDN releases an updated page
    defaultValue: null
  }),
  disableEmbedding: _configSchema.schema.boolean({
    defaultValue: false
  }) // is used to control X-Frame-Options and CSP headers

});
/**
 * Parses raw security header config info, returning an object with the appropriate header keys and values.
 *
 * @param raw
 * @internal
 */


exports.securityResponseHeadersSchema = securityResponseHeadersSchema;

function parseRawSecurityResponseHeadersConfig(raw) {
  const securityResponseHeaders = {};
  const {
    disableEmbedding
  } = raw;

  if (raw.strictTransportSecurity) {
    securityResponseHeaders['Strict-Transport-Security'] = raw.strictTransportSecurity;
  }

  if (raw.xContentTypeOptions) {
    securityResponseHeaders['X-Content-Type-Options'] = raw.xContentTypeOptions;
  }

  if (raw.referrerPolicy) {
    securityResponseHeaders['Referrer-Policy'] = raw.referrerPolicy;
  }

  if (raw.permissionsPolicy) {
    securityResponseHeaders['Permissions-Policy'] = raw.permissionsPolicy;
  }

  if (disableEmbedding) {
    securityResponseHeaders['X-Frame-Options'] = 'SAMEORIGIN';
  }

  return {
    securityResponseHeaders,
    disableEmbedding
  };
}