"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerGetAllRoute = registerGetAllRoute;
exports.registerGetOneRoute = registerGetOneRoute;

var _configSchema = require("@kbn/config-schema");

var _lib = require("../../../../common/lib");

var _get_managed_templates = require("../../../lib/get_managed_templates");

var _index = require("../index");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerGetAllRoute({
  router,
  lib: {
    handleEsError
  }
}) {
  router.get({
    path: (0, _index.addBasePath)('/index_templates'),
    validate: false
  }, async (context, request, response) => {
    const {
      client
    } = context.core.elasticsearch;

    try {
      const cloudManagedTemplatePrefix = await (0, _get_managed_templates.getCloudManagedTemplatePrefix)(client);
      const {
        body: legacyTemplatesEs
      } = await client.asCurrentUser.indices.getTemplate();
      const {
        body: {
          index_templates: templatesEs
        }
      } = await client.asCurrentUser.indices.getIndexTemplate();
      const legacyTemplates = (0, _lib.deserializeLegacyTemplateList)(legacyTemplatesEs, cloudManagedTemplatePrefix);
      const templates = (0, _lib.deserializeTemplateList)(templatesEs, cloudManagedTemplatePrefix);
      const body = {
        templates,
        legacyTemplates
      };
      return response.ok({
        body
      });
    } catch (error) {
      return handleEsError({
        error,
        response
      });
    }
  });
}

const paramsSchema = _configSchema.schema.object({
  name: _configSchema.schema.string()
}); // Require the template format version (V1 or V2) to be provided as Query param


const querySchema = _configSchema.schema.object({
  legacy: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.literal('true'), _configSchema.schema.literal('false')]))
});

function registerGetOneRoute({
  router,
  lib: {
    handleEsError
  }
}) {
  router.get({
    path: (0, _index.addBasePath)('/index_templates/{name}'),
    validate: {
      params: paramsSchema,
      query: querySchema
    }
  }, async (context, request, response) => {
    const {
      client
    } = context.core.elasticsearch;
    const {
      name
    } = request.params;
    const isLegacy = request.query.legacy === 'true';

    try {
      const cloudManagedTemplatePrefix = await (0, _get_managed_templates.getCloudManagedTemplatePrefix)(client);

      if (isLegacy) {
        const {
          body: indexTemplateByName
        } = await client.asCurrentUser.indices.getTemplate({
          name
        });

        if (indexTemplateByName[name]) {
          return response.ok({
            body: (0, _lib.deserializeLegacyTemplate)({ ...indexTemplateByName[name],
              name
            }, cloudManagedTemplatePrefix)
          });
        }
      } else {
        const {
          body: {
            index_templates: indexTemplates
          }
        } = await client.asCurrentUser.indices.getIndexTemplate({
          name
        });

        if (indexTemplates.length > 0) {
          return response.ok({
            body: (0, _lib.deserializeTemplate)({ ...indexTemplates[0].index_template,
              name
            }, cloudManagedTemplatePrefix)
          });
        }
      }

      return response.notFound();
    } catch (error) {
      return handleEsError({
        error,
        response
      });
    }
  });
}