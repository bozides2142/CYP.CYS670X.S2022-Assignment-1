"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineEnrollRoutes = defineEnrollRoutes;

var _operators = require("rxjs/operators");

var _configSchema = require("@kbn/config-schema");

var _common = require("../../common");

var _compatibility_error = require("../compatibility_error");

var _elasticsearch_service = require("../elasticsearch_service");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Defines routes to deal with Elasticsearch `enroll_kibana` APIs.
 */
function defineEnrollRoutes({
  router,
  logger,
  kibanaConfigWriter,
  elasticsearch,
  verificationCode,
  preboot
}) {
  router.post({
    path: '/internal/interactive_setup/enroll',
    validate: {
      body: _configSchema.schema.object({
        hosts: _configSchema.schema.arrayOf(_configSchema.schema.uri({
          scheme: 'https'
        }), {
          minSize: 1
        }),
        apiKey: _configSchema.schema.string({
          minLength: 1
        }),
        caFingerprint: _configSchema.schema.string({
          maxLength: 64,
          minLength: 64
        }),
        code: _configSchema.schema.maybe(_configSchema.schema.string())
      })
    },
    options: {
      authRequired: false
    }
  }, async (context, request, response) => {
    if (!verificationCode.verify(request.body.code)) {
      return response.forbidden();
    }

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

    const connectionStatus = await elasticsearch.connectionStatus$.pipe((0, _operators.first)()).toPromise();

    if (connectionStatus === _common.ElasticsearchConnectionStatus.Configured) {
      logger.error(`Invalid request to [path=${request.url.pathname}], Elasticsearch connection is already configured.`);
      return response.badRequest({
        body: {
          message: 'Elasticsearch connection is already configured.',
          attributes: {
            type: _common.ERROR_ELASTICSEARCH_CONNECTION_CONFIGURED
          }
        }
      });
    } // The most probable misconfiguration case is when Kibana process isn't allowed to write to the
    // Kibana configuration file. We'll still have to handle possible filesystem access errors
    // when we actually write to the disk, but this preliminary check helps us to avoid unnecessary
    // enrollment call and communicate that to the user early.


    const isConfigWritable = await kibanaConfigWriter.isConfigWritable();

    if (!isConfigWritable) {
      logger.error('Kibana process does not have enough permissions to write to config file');
      return response.customError({
        statusCode: 500,
        body: {
          message: 'Kibana process does not have enough permissions to write to config file.',
          attributes: {
            type: _common.ERROR_KIBANA_CONFIG_NOT_WRITABLE
          }
        }
      });
    }

    let configToWrite;

    try {
      configToWrite = await elasticsearch.enroll({
        apiKey: request.body.apiKey,
        hosts: request.body.hosts,
        caFingerprint: _elasticsearch_service.ElasticsearchService.formatFingerprint(request.body.caFingerprint)
      });
    } catch (error) {
      if (error instanceof _compatibility_error.CompatibilityError) {
        return response.badRequest({
          body: {
            message: 'Failed to enroll due to version incompatibility.',
            attributes: {
              type: _common.ERROR_COMPATIBILITY_FAILURE,
              elasticsearchVersion: error.elasticsearchVersion,
              kibanaVersion: error.kibanaVersion
            }
          }
        });
      } // For security reasons, we shouldn't leak to the user whether Elasticsearch node couldn't process enrollment
      // request or we just couldn't connect to any of the provided hosts.


      return response.customError({
        statusCode: 500,
        body: {
          message: 'Failed to enroll.',
          attributes: {
            type: _common.ERROR_ENROLL_FAILURE
          }
        }
      });
    }

    try {
      await kibanaConfigWriter.writeConfig(configToWrite);
    } catch {
      // For security reasons, we shouldn't leak any filesystem related errors.
      return response.customError({
        statusCode: 500,
        body: {
          message: 'Failed to save configuration.',
          attributes: {
            type: _common.ERROR_KIBANA_CONFIG_FAILURE
          }
        }
      });
    }

    preboot.completeSetup({
      shouldReloadConfig: true
    });
    return response.noContent();
  });
}