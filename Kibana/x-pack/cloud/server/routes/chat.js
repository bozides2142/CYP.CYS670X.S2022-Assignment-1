"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerChatRoute = void 0;

var _constants = require("../../common/constants");

var _generate_jwt = require("../util/generate_jwt");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const registerChatRoute = ({
  router,
  chatIdentitySecret,
  security,
  isDev
}) => {
  if (!security) {
    return;
  }

  router.get({
    path: _constants.GET_CHAT_USER_DATA_ROUTE_PATH,
    validate: {}
  }, async (_context, request, response) => {
    const user = security.authc.getCurrentUser(request);
    const {
      metadata,
      username
    } = user || {};
    let userId = username;
    let [userEmail] = (metadata === null || metadata === void 0 ? void 0 : metadata.saml_email) || []; // In local development, these values are not populated.  This is a workaround
    // to allow for local testing.

    if (isDev) {
      if (!userId) {
        userId = 'first.last';
      }

      if (!userEmail) {
        userEmail = userEmail || `test+${userId}@elasticsearch.com`;
      }
    }

    if (!userEmail || !userId) {
      return response.badRequest({
        body: 'User has no email or username'
      });
    }

    const token = (0, _generate_jwt.generateSignedJwt)(userId, chatIdentitySecret);
    const body = {
      token,
      email: userEmail,
      id: userId
    };
    return response.ok({
      body
    });
  });
};

exports.registerChatRoute = registerChatRoute;