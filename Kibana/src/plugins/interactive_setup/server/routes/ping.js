"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.definePingRoute = definePingRoute;

var _configSchema = require("@kbn/config-schema");

var _common = require("../../common");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function definePingRoute({
  router,
  logger,
  elasticsearch,
  preboot
}) {
  router.post({
    path: '/internal/interactive_setup/ping',
    validate: {
      body: _configSchema.schema.object({
        host: _configSchema.schema.uri({
          scheme: ['http', 'https']
        })
      })
    },
    options: {
      authRequired: false
    }
  }, async (context, request, response) => {
    if (!preboot.isSetupOnHold()) {
      logger.error(`Invalid request to [path=${request.url.pathname}] outside of preboot stage`);
      return response.badRequest({
        body: {
          message: 'Cannot process request outside of preboot stage.',
          attributes: {
            type: _common.ERROR_OUTSIDE_PREBOOT_STAGE
          }
        }
      });
    }

    let result;

    try {
      result = await elasticsearch.ping(request.body.host);
    } catch {
      return response.customError({
        statusCode: 500,
        body: {
          message: 'Failed to ping cluster.',
          attributes: {
            type: _common.ERROR_PING_FAILURE
          }
        }
      });
    }

    return response.ok({
      body: result
    });
  });
}