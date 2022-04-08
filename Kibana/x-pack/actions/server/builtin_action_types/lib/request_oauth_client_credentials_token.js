"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OAUTH_CLIENT_CREDENTIALS_GRANT_TYPE = void 0;
exports.requestOAuthClientCredentialsToken = requestOAuthClientCredentialsToken;

var _request_oauth_token = require("./request_oauth_token");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const OAUTH_CLIENT_CREDENTIALS_GRANT_TYPE = 'client_credentials';
exports.OAUTH_CLIENT_CREDENTIALS_GRANT_TYPE = OAUTH_CLIENT_CREDENTIALS_GRANT_TYPE;

const rewriteBodyRequest = ({
  clientId,
  clientSecret,
  ...res
}) => ({ ...res,
  client_id: clientId,
  client_secret: clientSecret
});

async function requestOAuthClientCredentialsToken(tokenUrl, logger, params, configurationUtilities) {
  return await (0, _request_oauth_token.requestOAuthToken)(tokenUrl, OAUTH_CLIENT_CREDENTIALS_GRANT_TYPE, configurationUtilities, logger, rewriteBodyRequest(params));
}