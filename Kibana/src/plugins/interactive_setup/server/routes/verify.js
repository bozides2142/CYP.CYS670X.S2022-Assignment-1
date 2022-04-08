"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineVerifyRoute = defineVerifyRoute;

var _configSchema = require("@kbn/config-schema");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function defineVerifyRoute({
  router,
  verificationCode
}) {
  router.post({
    path: '/internal/interactive_setup/verify',
    validate: {
      body: _configSchema.schema.object({
        code: _configSchema.schema.string()
      })
    },
    options: {
      authRequired: false
    }
  }, async (context, request, response) => {
    if (!verificationCode.verify(request.body.code)) {
      return response.forbidden({
        body: {
          message: verificationCode.remainingAttempts ? 'Invalid verification code.' : 'Maximum number of attempts exceeded. Restart Kibana to generate a new code and retry.',
          attributes: {
            remainingAttempts: verificationCode.remainingAttempts
          }
        }
      });
    }

    return response.noContent();
  });
}