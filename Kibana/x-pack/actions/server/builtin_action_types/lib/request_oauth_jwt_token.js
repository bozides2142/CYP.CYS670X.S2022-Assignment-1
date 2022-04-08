"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OAUTH_JWT_BEARER_GRANT_TYPE = void 0;
exports.requestOAuthJWTToken = requestOAuthJWTToken;

var _request_oauth_token = require("./request_oauth_token");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// This is a standard for JSON Web Token (JWT) Profile
// for OAuth 2.0 Client Authentication and Authorization Grants https://datatracker.ietf.org/doc/html/rfc7523#section-8.1


const OAUTH_JWT_BEARER_GRANT_TYPE = 'urn:ietf:params:oauth:grant-type:jwt-bearer';
exports.OAUTH_JWT_BEARER_GRANT_TYPE = OAUTH_JWT_BEARER_GRANT_TYPE;

const rewriteBodyRequest = ({
  clientId,
  clientSecret,
  ...res
}) => ({ ...res,
  client_id: clientId,
  client_secret: clientSecret
});

async function requestOAuthJWTToken(tokenUrl, params, logger, configurationUtilities) {
  return await (0, _request_oauth_token.requestOAuthToken)(tokenUrl, OAUTH_JWT_BEARER_GRANT_TYPE, configurationUtilities, logger, rewriteBodyRequest(params));
}